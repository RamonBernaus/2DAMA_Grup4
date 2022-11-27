package com.example.projecte_senser;

public class Data {
    private String name;
    private String tipus;
    private long preu;

    public Data(String name, String tipus,long preu){
        this.name = name;
        this.tipus = tipus;
        this.preu = preu;
    }


    public String getName() {
        return name;
    }

    public String getTipus() {
        return tipus;
    }

    public long getPreu() {
        return preu;
    }
}
