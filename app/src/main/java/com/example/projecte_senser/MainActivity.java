package com.example.projecte_senser;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    Button login_button;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        login_button = findViewById(R.id.login);
        login_button.setOnClickListener(view -> switchActivities());
    }

    private void switchActivities() {
        Intent switchActivityIntent = new Intent(this, RecyclerViewMain.class);
        startActivity(switchActivityIntent);
    }



}