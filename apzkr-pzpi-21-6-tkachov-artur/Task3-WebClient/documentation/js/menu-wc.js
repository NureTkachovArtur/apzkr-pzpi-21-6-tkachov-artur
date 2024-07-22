'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">medireminder-client documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-933fb7fda1de64114ad9225c212511fc475194f450747de268399ab1bb7cd3f70169054f90dcbe6d81ff57dfff3f9969fee57904714ccaa5ed933d01e961aa23"' : 'data-bs-target="#xs-components-links-module-AppModule-933fb7fda1de64114ad9225c212511fc475194f450747de268399ab1bb7cd3f70169054f90dcbe6d81ff57dfff3f9969fee57904714ccaa5ed933d01e961aa23"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-933fb7fda1de64114ad9225c212511fc475194f450747de268399ab1bb7cd3f70169054f90dcbe6d81ff57dfff3f9969fee57904714ccaa5ed933d01e961aa23"' :
                                            'id="xs-components-links-module-AppModule-933fb7fda1de64114ad9225c212511fc475194f450747de268399ab1bb7cd3f70169054f90dcbe6d81ff57dfff3f9969fee57904714ccaa5ed933d01e961aa23"' }>
                                            <li class="link">
                                                <a href="components/AddMedicineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddMedicineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminPanelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdministratorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdministratorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateAdministratorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateAdministratorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateDoctorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateDoctorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateMedicationScheduleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateMedicationScheduleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateMedicineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateMedicineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateMessageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateMessageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateMessageTypeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateMessageTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreatePatientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreatePatientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreatePatientDoctorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreatePatientDoctorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreatePatientTrusteeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreatePatientTrusteeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateScheduleEventComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateScheduleEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateSmartDeviceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateSmartDeviceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateSmartDeviceTypeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateSmartDeviceTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CreateTrusteeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateTrusteeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DoctorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DoctorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditMedicineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditMedicineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MedicationSchedulesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicationSchedulesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MedicinesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicinesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MedicinesViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MedicinesViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageTypesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageTypesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessagesViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientDoctorsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PatientDoctorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientTrusteesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PatientTrusteesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PatientsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientsViewDoctorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PatientsViewDoctorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientsViewTrusteeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PatientsViewTrusteeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutAdministratorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutAdministratorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutDoctorComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutDoctorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutMedicationScheduleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutMedicationScheduleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutMedicineComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutMedicineComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutMessageComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutMessageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutMessageTypeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutMessageTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutPatientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutPatientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutSmartDeviceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutSmartDeviceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutSmartDeviceTypeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutSmartDeviceTypeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PutTrusteeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PutTrusteeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterDoctorFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterDoctorFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterPatientFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterPatientFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterTrusteeFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterTrusteeFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScheduleEventComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScheduleEventComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScheduleViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScheduleViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SmartDeviceTypesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartDeviceTypesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SmartDevicesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SmartDevicesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatisticsViewComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticsViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TrusteesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrusteesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/LoginData.html" data-type="entity-link" >LoginData</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-1.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-2.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-3.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-4.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-5.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-6.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-7.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-8.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-9.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-10.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-11.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/POSTValues-12.html" data-type="entity-link" >POSTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-1.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-2.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-3.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-4.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-5.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-6.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-7.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-8.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-9.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/PUTValues-10.html" data-type="entity-link" >PUTValues</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterData.html" data-type="entity-link" >RegisterData</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterData-1.html" data-type="entity-link" >RegisterData</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterData-2.html" data-type="entity-link" >RegisterData</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interceptors-links"' :
                            'data-bs-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});