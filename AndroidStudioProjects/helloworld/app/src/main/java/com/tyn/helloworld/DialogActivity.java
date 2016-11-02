package com.tyn.helloworld;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.net.nsd.NsdManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.Toast;

public class DialogActivity extends AppCompatActivity {
    private EditText dtName = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dialog);
        findViewById(R.id.dialog1).setOnClickListener(listener);
        findViewById(R.id.dialog2).setOnClickListener(listener);
        findViewById(R.id.dialog3).setOnClickListener(listener);
        findViewById(R.id.dialog4).setOnClickListener(listener);

    }

    private View.OnClickListener listener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            switch (view.getId()) {
                case R.id.dialog1:
                    onDialog1Show();
                    break;
                case R.id.dialog2:
                    new AlertDialog.Builder(DialogActivity.this)
                            .setTitle("请输入").setIcon(
                            android.R.drawable.ic_dialog_info)
                            .setView(
                                    new EditText(DialogActivity.this))
                            .setPositiveButton("确定", null)
                            .setNegativeButton("取消", null)
                            .show();
                    break;
                case R.id.dialog3:
                    new AlertDialog.Builder(DialogActivity.this).setTitle("复选框").setMultiChoiceItems(
                            new String[]{"Item1", "Item2"}, null, null)
                            .setPositiveButton("确定", null)
                            .setNegativeButton("取消", null).show();
                    break;
                case R.id.dialog4:
                    definedDialogShow();
                    break;
            }

        }
    };

    //效果1
    private void onDialog1Show() {
        Dialog dialog = new AlertDialog.Builder(this).setIcon(
                android.R.drawable.btn_star).setTitle("喜好调查").setMessage(
                "你喜欢李连杰的电影吗？").setPositiveButton("很喜欢",
                new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        // TODO Auto-generated method stub
                        Toast.makeText(DialogActivity.this, "我很喜欢他的电影。",
                                Toast.LENGTH_LONG).show();
                    }
                }).setNegativeButton("不喜欢", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                // TODO Auto-generated method stub
                Toast.makeText(DialogActivity.this, "我不喜欢他的电影。", Toast.LENGTH_LONG)
                        .show();
            }
        }).setNeutralButton("一般", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                // TODO Auto-generated method stub
                Toast.makeText(DialogActivity.this, "谈不上喜欢不喜欢。", Toast.LENGTH_LONG)
                        .show();
            }
        }).create();

        dialog.show();
    }

    //自定义弹框，并获取弹框中的值
    private void definedDialogShow() {
        LayoutInflater inflater = getLayoutInflater();
        //定义为final，则java编译器则会在内部类内生成一个外部变量的拷贝，
        // 而且既可以保证内部类可以引用外部属性，又能保证值的唯一性
        final View layout = inflater.inflate(R.layout.defined_dialog, (ViewGroup) findViewById(R.id.definedDialog));
        new AlertDialog.Builder(DialogActivity.this).setTitle("自定义布局").setView(layout)
                .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //获取自定义弹框中的EditText中的值
                        EditText editText = (EditText) layout.findViewById(R.id.etname);
                        String name = "";
                        if (editText != null) {
                            name = editText.getText().toString();
                        }
                        Toast.makeText(DialogActivity.this, "你的姓名叫:" + name, Toast.LENGTH_LONG)
                                .show();
                    }
                })
                .setNegativeButton("取消", null)
                .show();
    }
}
