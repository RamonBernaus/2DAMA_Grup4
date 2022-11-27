package com.example.projecte_senser;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class RecyclerViewMain extends AppCompatActivity {

    DatabaseAdapter databaseAdapter;
    RecyclerView Lista;
    WordListAdapter contactsAdapter;
    RecyclerView.LayoutManager layoutManager;
    List<Data> contactsList = new ArrayList<>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.recyclerview);
        PreCreateDB.copyDB(this);
        databaseAdapter = new DatabaseAdapter(this);
        contactsList = databaseAdapter.getAllContacts();
        Lista = findViewById(R.id.Lista);
        Lista.setHasFixedSize(true);
        layoutManager = new LinearLayoutManager(this);
        Lista.setLayoutManager(layoutManager);
        contactsAdapter = new WordListAdapter(this, contactsList, Lista);
        Lista.setAdapter(contactsAdapter);
    }
}

