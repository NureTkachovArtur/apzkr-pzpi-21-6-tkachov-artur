#include <Arduino.h>
#include "FS.h"
#include <LittleFS.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <RTClib.h>
#include <SPI.h>

#define UPDATE_INTERVAL 10

unsigned long lastUpdate = 0;

RTC_DS3231 rtc;

const String configFileName = "config.json";
const char* ssid = "TP-Link_5B6C";
const char* password = "02598291";

String serverHost = "https://8jqhq5mq-7027.euw.devtunnels.ms/api/";
String serverActivatePath = "SmartDevices/Activate";
String serverUpdateStatisticPath = "MedicationStatistics";
String serverDeviceInfoPath = "SmartDevices/deviceInfo";

struct {
  int deviceId;
  String authenticationToken;
  int patientId = -1;
  int medicationScheduleId = -1;
} config;

HTTPClient http;
bool isOpen = false;
bool lastState = false;

void readFile(){ 
  JsonDocument doc;
  File file = LittleFS.open(configFileName);
  if(!file || file.isDirectory()){
    Serial.println("- failed to open file for reading");
    return;
  }

  deserializeJson(doc, file);

  config.deviceId = doc["deviceId"].as<int>();
  config.authenticationToken = doc["authenticationToken"].as<String>();
  config.patientId = doc["patientId"].as<int>();
  config.medicationScheduleId = doc["medicationScheduleId"].as<int>();

  file.close();
}

void writeFile(){
  JsonDocument doc;

  doc["deviceId"] = config.deviceId;
  doc["patientId"] = config.patientId;
  doc["authenticationToken"] = config.authenticationToken;
  doc["medicationScheduleId"] = config.medicationScheduleId;

  File file = LittleFS.open(configFileName, FILE_WRITE);
  if(!file){
    Serial.println("- failed to open file for writing");
    return;
  }

  serializeJson(doc, file);
  file.close();
}

String displayDigit(int num) {
  String number = "";
  if (num < 10) {
    number = "0" + String(num);
  }
  else {
    number = String(num);
  }
  return number;
}

String getCurrentDateTime() {
  DateTime now = rtc.now();

  String result = String(now.year());
  result += "-" + displayDigit(now.month());
  result += "-" + displayDigit(now.day());
  result += "T" + displayDigit(now.hour());
  result += ":" + displayDigit(now.minute());
  result += ":" + displayDigit(now.second());

  return result;
}

void workflow() {
  bool currentState = digitalRead(23);
  if (currentState != lastState) {
    lastState = currentState;
    
    if (WiFi.status() == WL_CONNECTED){
      String serverPath = serverHost + serverUpdateStatisticPath;
      http.begin(serverPath.c_str());
      http.addHeader("Content-Type", "application/json");

      JsonDocument doc;
      doc["patientId"] = config.patientId;
      doc["medicationScheduleId"] = config.medicationScheduleId;
      doc["medicationTime"] = getCurrentDateTime();
      doc["missedDose"] = false;

      String requestBody;
      serializeJson(doc, requestBody);

      int httpResponseCode = http.POST(requestBody);
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        Serial.print("Response: ");
        Serial.println(response);
      } else {
        Serial.print("Error code: ");
        Serial.println(httpResponseCode);
      }
      http.end();
    }
  }
}

void activate() {
  if (config.patientId > 0) {
    return;
  }

  if (WiFi.status() == WL_CONNECTED){
    String serverPath = serverHost + serverActivatePath;
    http.begin(serverPath.c_str());

    http.addHeader("DeviceId", String(config.deviceId));
    http.addHeader("Token", config.authenticationToken);

    int httpResponseCode = http.PUT("");
    if (httpResponseCode>0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      JsonDocument doc;
      deserializeJson(doc, payload);
      config.authenticationToken = doc["authenticationToken"].as<String>();;
      config.patientId = doc["patientId"].as<int>();;
      writeFile();
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  else {
    Serial.println("WiFi Disconnected");
  }
}

void setup() {
  pinMode(23, INPUT);

  Serial.begin(115200);
  if(!LittleFS.begin(true)){
    Serial.println("LittleFS Mount Failed");
    return;
  }

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC. Dead now.");
    while(1);
  }

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected");

  readFile();
  activate();
}

void loop() {
  if(millis() - lastUpdate >= UPDATE_INTERVAL * 1000){
    
    if (WiFi.status() == WL_CONNECTED){
      String serverPath = serverHost + serverDeviceInfoPath;
      http.begin(serverPath.c_str());

      http.addHeader("DeviceId", String(config.deviceId));
      http.addHeader("Token", config.authenticationToken);

      int httpResponseCode = http.GET();
      if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        String payload = http.getString();
        JsonDocument doc;
        deserializeJson(doc, payload);
        config.medicationScheduleId = doc["medicationScheduleId"];
        writeFile();
      }
    }

    lastUpdate = millis();
  }

  workflow();
}