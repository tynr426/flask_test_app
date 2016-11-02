package com.tyn.helloworld;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

public class LaunchModeA extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_launch_mode);
        TextView tv = (TextView) findViewById(R.id.tv);
        tv.setText(String.format("TaskId=%d;\n Current Activity id=%s", getTaskId(), toString()));
        findViewById(R.id.btnStartA).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(LaunchModeA.this, LaunchModeA.class);
                startActivity(i);
            }
        });
        findViewById(R.id.btnStartB).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent i = new Intent(LaunchModeA.this, LaunchModeB.class);
                startActivity(i);
            }
        });
    }
}
