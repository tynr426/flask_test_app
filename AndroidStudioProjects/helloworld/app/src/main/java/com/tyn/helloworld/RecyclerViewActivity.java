package com.tyn.helloworld;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

/*
 * layout manager不仅负责将item放入RecyclerView 中，还负责决定何时重用那些已经不在视野范围内的item，
 * 这点和ListView类似，不过RecyclerView 将这个功能从ListView分离出来交给了layout manager。

 如果要自定义item的动画 需要一个继承 RecyclerView.ItemAnimator的类，然后使用RecyclerView.setItemAnimator
 来设置动画。
* */
public class RecyclerViewActivity extends AppCompatActivity {
    //RecyclerView 是Android L版本中新添加的一个用来取代ListView的SDK，它的灵活性与可替代性比listview更好
    private RecyclerView rv;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        rv = new RecyclerView(this);
        setContentView(rv);
        //设置布局方式
        rv.setLayoutManager(new GridLayoutManager(this, 3));
        //rv.setLayoutManager(new LinearLayoutManager(this,LinearLayoutManager.HORIZONTAL,true));
        //填充内容
        CustomRecyclerViewAdapter adapter = new CustomRecyclerViewAdapter(data);
        adapter.setOnItemClickListener(new CustomRecyclerViewAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position) {
                TextView tv = (TextView) view.findViewById(R.id.tvTitle);
                Toast.makeText(RecyclerViewActivity.this, tv.getText(), Toast.LENGTH_SHORT)
                        .show();
            }
        });
        rv.setAdapter(adapter);
    }

    private CellData[] data = new CellData[]{
            new CellData("今日头条", "全是爆炸性的"),
            new CellData("新歌曲推荐", "来吧来吧"),
            new CellData("科技行业", "全是爆炸性的"),
            new CellData("全球五百强", "来吧来吧"),
            new CellData("理财行业", "全是爆炸性的"),
            new CellData("IT行业", "来吧来吧"),
            new CellData("金融行业", "全是爆炸性的"),
            new CellData("娱乐行业", "来吧来吧")
    };
}
