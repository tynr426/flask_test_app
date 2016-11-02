package com.tyn.helloworld;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

public class RecyclerViewActivity extends AppCompatActivity {
    private RecyclerView rv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        rv = new RecyclerView(this);
        setContentView(rv);
        //布局
        rv.setLayoutManager(new GridLayoutManager(this, 3));
        //rv.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,true));
        //填充内容
        MyFirstAdapter adapter = new MyFirstAdapter();
        adapter.setmOnItemClickLitener(new MyFirstAdapter.OnItemClickLitener() {
            @Override
            public void onItemClick(View view, int position) {
                TextView tv = (TextView) view.findViewById(R.id.tvTitle);
                Toast.makeText(RecyclerViewActivity.this, tv.getText(), Toast.LENGTH_SHORT)
                        .show();
            }
        });
        rv.setAdapter(adapter);
    }

}
