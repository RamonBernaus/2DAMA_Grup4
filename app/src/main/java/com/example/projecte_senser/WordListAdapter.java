package com.example.projecte_senser;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class WordListAdapter extends RecyclerView.Adapter<WordListAdapter.ViewHolder>  {
    Context context;
    List<Data> dataList;
    RecyclerView Lista;
    final View.OnClickListener onClickListener = new MyOnClickListener();

    public static class ViewHolder extends RecyclerView.ViewHolder{
        TextView rowName;
        TextView rowTipus;
        TextView rowPreu;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            rowName = itemView.findViewById(R.id.item_name);
            rowTipus = itemView.findViewById(R.id.item_tipus);
            rowPreu = itemView.findViewById(R.id.item_preu);
        }
    }

    public WordListAdapter(Context context, List<Data> dataList,RecyclerView Llista) {
        this.context = context;
        this.dataList = dataList;
        this.Lista = Llista;
    }
    @NonNull
    @Override
    public WordListAdapter.ViewHolder onCreateViewHolder(@NonNull ViewGroup viewGroup, int i) {
        LayoutInflater inflater = LayoutInflater.from(context);
        View view = inflater.inflate(R.layout.wordlist_item, viewGroup, false);
        view.setOnClickListener(onClickListener);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull WordListAdapter.ViewHolder viewHolder, int i) {
        Data contact = dataList.get(i);
        viewHolder.rowPreu.setText(""+contact.getPreu());
        viewHolder.rowName.setText(contact.getName());
        viewHolder.rowTipus.setText(contact.getTipus());
    }

    @Override
    public int getItemCount() {
        return dataList.size();
    }

    private class MyOnClickListener implements View.OnClickListener {
        @Override
        public void onClick(View v) {
            int itemPosition = Lista.getChildLayoutPosition(v);
            String item = dataList.get(itemPosition).getName();
            Toast.makeText(context, item, Toast.LENGTH_SHORT).show();
        }
    }



}

