package com.tyn.app2;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

import org.w3c.dom.Text;

public class OtherActivity extends AppCompatActivity {

    public final static String ACTION = "com.tyn.app2.Other";
    public final static String APPACTION = "com.tyn.helloworld.OtherActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_other);
        TextView tvParam = (TextView) findViewById(R.id.tvParam);
        tvParam.setText("参数为空：" + getIntent().getData().toString());
    }
}
