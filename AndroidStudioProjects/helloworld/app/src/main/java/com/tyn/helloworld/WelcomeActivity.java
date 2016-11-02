package com.tyn.helloworld;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ProviderInfo;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class WelcomeActivity extends Activity {

    private boolean isFirstIn=false;
    private static final int SETTIMEOUT=2000;
    private static final int GO_HOME=1000;
    private static final int GO_GUID=2000;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_welcome);
        init();
    }
    private Handler handler=new Handler(){
        @Override
        public void handleMessage(Message msg) {
            Intent intent;
           switch (msg.what){
               case GO_GUID:
                   intent=new Intent(WelcomeActivity.this,GuidActivity.class);
                   startActivity(intent);
                   break;
               case GO_HOME:
                   intent=new Intent(WelcomeActivity.this,MainActivity.class);
                   startActivity(intent);
                   break;
           }
        }
    };
    private void init(){
        //数据存储
        SharedPreferences sharedPreferences=getSharedPreferences("tyn",MODE_PRIVATE);
        isFirstIn=sharedPreferences.getBoolean("isFirstIn",true);
        if(!isFirstIn){
            handler.sendEmptyMessageAtTime(GO_HOME,SETTIMEOUT);
        }
        else{
            handler.sendEmptyMessageAtTime(GO_GUID,SETTIMEOUT);
            SharedPreferences.Editor editor=sharedPreferences.edit();
            editor.putBoolean("isFirstIn",false);
            editor.commit();
        }
    }
}
