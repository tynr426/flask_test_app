package com.tyn.helloworld;

import android.app.Application;

/**
 * Created by apple on 16/8/28.
 */
public class App extends Application {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }
}
