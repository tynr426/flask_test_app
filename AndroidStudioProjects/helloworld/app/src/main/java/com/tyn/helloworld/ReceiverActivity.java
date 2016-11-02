package com.tyn.helloworld;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

public class ReceiverActivity extends AppCompatActivity implements View.OnClickListener {

    private MyFirstReceiver receiver=null;
    private EditText et = null;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_receiver);
        et = (EditText) findViewById(R.id.et);
        findViewById(R.id.btnRegReceiver).setOnClickListener(this);
        findViewById(R.id.btnUnRegReceiver).setOnClickListener(this);
        findViewById(R.id.btnSendReceiver).setOnClickListener(this);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btnRegReceiver://手动注册
             if(receiver==null){
                 receiver=new MyFirstReceiver();
                 registerReceiver(receiver,new IntentFilter(MyFirstReceiver.ACTION));
             }
                break;
            case R.id.btnUnRegReceiver:
                if(receiver!=null) {

                    unregisterReceiver(receiver);
                    receiver=null;
                }
                break;

            case R.id.btnSendReceiver:
                Intent i = new Intent(MyFirstReceiver.ACTION);
                //传递参数
                i.putExtra("name", et.getText().toString());
                sendBroadcast(i);
                break;
        }
    }
}
