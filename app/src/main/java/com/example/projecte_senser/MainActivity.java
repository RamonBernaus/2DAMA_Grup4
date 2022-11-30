package com.example.projecte_senser;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    Button login_button;
    Button New_user;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        login_button = findViewById(R.id.login);
        login_button.setOnClickListener(view -> switchActivities());
        New_user = findViewById(R.id.new_user);
        New_user.setOnClickListener(view -> switchActivities2());
    }

    private void switchActivities() {
        Intent switchActivityIntent = new Intent(this, RecyclerViewMain.class);
        startActivity(switchActivityIntent);
    }

    private void switchActivities2() {
        Intent switchActivityIntent = new Intent(this, MenuJava.class);
        startActivity(switchActivityIntent);
    }



}