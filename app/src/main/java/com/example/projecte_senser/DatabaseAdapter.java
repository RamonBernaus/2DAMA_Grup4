package com.example.projecte_senser;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.widget.Toast;
import java.util.ArrayList;
import java.util.List;

public class DatabaseAdapter {

    DatabaseHelper helper;
    SQLiteDatabase db;
    List<Data> contactsList = new ArrayList<>();

    public DatabaseAdapter(Context context) {
        helper = new DatabaseHelper(context);
        db = helper.getWritableDatabase();
    }

    public List<Data> getAllContacts(){
        String columns[] = {DatabaseHelper.KEY_NAME, DatabaseHelper.KEY_TIPUS, DatabaseHelper.KEY_PREU};
        Cursor cursor = db.rawQuery("SELECT * FROM Productes ", null);
        while(cursor.moveToNext()){
            int index1 = cursor.getColumnIndex(DatabaseHelper.KEY_NAME);
            String name = cursor.getString(index1);
            int index2 = cursor.getColumnIndex(DatabaseHelper.KEY_TIPUS);
            String tipus = cursor.getString(index2);
            int index3 = cursor.getColumnIndex(DatabaseHelper.KEY_PREU);
             int preu = cursor.getInt(index3);
            Data data = new Data(name, tipus, preu);
            contactsList.add(data);
        }
        return contactsList;
    }

    private static class DatabaseHelper extends SQLiteOpenHelper {


        private static final String DATABASE_NAME = "a21rambertor_Dades_Projecte.sql";
        private static final String TABLE_NAME = "Productes";
        // When you do change the structure of the database change the version number from 1 to 2
        private static final int DATABASE_VERSION = 1;
        private static final String KEY_NAME="name";
        private static final String KEY_PREU = "preu";
        private static final String KEY_TIPUS = "tipus";
        private static final String CREATE_TABLE = "CREATE TABLE "+ TABLE_NAME+
                " ("+ KEY_NAME +" varchar(100), " + KEY_TIPUS + " varchar(100), "+ KEY_PREU + " int)";
        private static final String DROP_TABLE = "drop table if exists "+ TABLE_NAME;
        private Context context;

        public DatabaseHelper(Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
            this.context = context;
            Toast.makeText(context, "constructor called", Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            try{
                db.execSQL(CREATE_TABLE);
                Toast.makeText(context, "onCreate called", Toast.LENGTH_SHORT).show();
            }catch (SQLException e){
                Toast.makeText(context, ""+e, Toast.LENGTH_SHORT).show();
            }
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            try{
                Toast.makeText(context, "onUpgrade called", Toast.LENGTH_SHORT).show();
                db.execSQL(DROP_TABLE);
                onCreate(db);
            }catch (SQLException e){
                Toast.makeText(context, ""+e, Toast.LENGTH_SHORT).show();
            }
        }
    }
}
