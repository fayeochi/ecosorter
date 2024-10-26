#include <Servo.h>

Servo servo1;
Servo servo2;
int angle1 = 90; 
int angle2 = 90; 

void setup() {
    Serial.begin(9600);
    servo1.attach(3);
    servo2.attach(9);

    // Initialize servo arm positions
    servo1.write(angle1);
    servo2.write(angle2);
}

void loop() {
    if (Serial.available() > 0) {
        //read and store the data from serial communication 
        //(0-trash-closed or 1-recyclable-open) 
        String detectedState = Serial.readStringUntil('\n');
        if (detectedState == "1") {
            // Move to correct arm angles for recyclable (open)
            servo1.write(180);
            servo2.write(0);
            delay(500);
        } else if (detectedState == "0") {
            // Move initial angles for non-recyclable (closed)
            servo1.write(angle1);
            servo2.write(angle2);
        }
    }
}
