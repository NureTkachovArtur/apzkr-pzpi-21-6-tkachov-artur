﻿namespace medireminder.GetDto
{
    public class MedicineGetDto
    {
        public int MedicineId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public float Dosage { get; set; }
        public DateOnly ExpirationDate { get; set; }
        public string Instruction { get; set; }
        public float Quantity { get; set; }
    }
}
