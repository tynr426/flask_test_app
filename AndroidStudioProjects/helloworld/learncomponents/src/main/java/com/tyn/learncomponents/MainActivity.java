package com.tyn.learncomponents;

import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TimePicker;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private Spinner spArea;
    private EditText etData;
    private RadioGroup rg;
    private String[] data = new String[]{
            "四川",
            "北京",
            "天津",
            "上海",
            "台湾",
            "广东",
            "重庆"
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        spArea = (Spinner) findViewById(R.id.spArea);
        etData = (EditText) findViewById(R.id.etData);
        rg = (RadioGroup) findViewById(R.id.rg);
        spArea.setAdapter(new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, data));
        spArea.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                Toast.makeText(MainActivity.this, data[i], Toast.LENGTH_LONG).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {

            }
        });
        etData.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                new DatePickerDialog(MainActivity.this, new DatePickerDialog.OnDateSetListener() {
//                    @Override
//                    public void onDateSet(DatePicker datePicker, int i, int i1, int i2) {
//                        etData.setText(String.format("%d-%d-%d",i,i1+1,i2));
//                    }
//                },2016,8,3).show();
                new TimePickerDialog(MainActivity.this, new TimePickerDialog.OnTimeSetListener() {
                    @Override
                    public void onTimeSet(TimePicker timePicker, int i, int i1) {
                        etData.setText(String.format("%d:%d", i, i1 + 1));
                    }
                }, 0, 0, true).show();
            }
        });
        rg.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup radioGroup, int i) {
                // TODO Auto-generated method stub
                //获取变更后的选中项的ID
                int radioButtonId = radioGroup.getCheckedRadioButtonId();
                //根据ID获取RadioButton的实例
                RadioButton rb = (RadioButton) MainActivity.this.findViewById(radioButtonId);
                //更新文本内容，以符合选中项
                System.out.println(rb.getText().toString());
               Toast.makeText(MainActivity.this,rb.getText().toString(),Toast.LENGTH_LONG).show();
            }
        });
    }
}
