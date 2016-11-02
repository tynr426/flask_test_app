package com.tyn.helloworld;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.ActionBarDrawerToggle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.SimpleAdapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
drawerlayout 注意事项
1、主内容视图一定要是DrawerLayout的第一个子视图
2、主内容视图宽度和高度匹配父视图，即match_parent
3、必须显示抽屉视图（如ListView)的android:layout_gravity属性，为start时从左向右滑出
* */
public class DrawerLayout extends Activity implements ListView.OnItemClickListener {
    private android.support.v4.widget.DrawerLayout mDrawerLayout;
    /*
    * 列表的显示需要三个元素：

        1．ListVeiw 用来展示列表的View。

        2．适配器 用来把数据映射到ListView上的中介。

        3．数据具体的将被映射的字符串，图片，或者基本组件。

        根据列表的适配器类型，列表分为三种，ArrayAdapter，SimpleAdapter和SimpleCursorAdapter
    * */
    private ListView mDrawerList;
    private List<Map<String, Object>> menuList;//数据
    private SimpleAdapter adapter;//适配器
    private ActionBarDrawerToggle mDrawerToggle;
    private String title;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_drawer_layout);
        title = (String) getTitle();
        mDrawerLayout = (android.support.v4.widget.DrawerLayout) findViewById(R.id.draw_layout);
        mDrawerList = (ListView) findViewById(R.id.left_drawer);

        adapter= new SimpleAdapter(this,getData(),R.layout.vlist,
                new String[]{"title","info","img"},
                new int[]{R.id.title,R.id.info,R.id.img});
        //adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, menuList);
        mDrawerList.setAdapter(adapter);
        mDrawerList.setOnItemClickListener(this);
/*if your activity includes the action bar, you can instead extend the ActionBarDrawerToggle class.
 The ActionBarDrawerToggle implements DrawerLayout.DrawerListener so you can still override those callbacks
* */
        mDrawerToggle = new ActionBarDrawerToggle(this,
                mDrawerLayout,
                R.string.ic_drawer_open,
                R.string.ic_drawer_close) {
            @Override
            /** 当抽屉完成关闭的时候调用. */
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                //getActionBar().setTitle("请选择");
                setTitle("请选择");
                invalidateOptionsMenu();//回调onPrepareOptionsMenu
            }

            @Override
            /** 当抽屉彻底打开的时候调用. */
            public void onDrawerClosed(View drawerView) {
                super.onDrawerClosed(drawerView);
                //getActionBar().setTitle(title);
                setTitle(title);
                invalidateOptionsMenu();
            }
        };
        mDrawerLayout.setDrawerListener(mDrawerToggle);
        getActionBar().setDisplayHomeAsUpEnabled(true);
        getActionBar().setHomeButtonEnabled(true);
    }

    private List<Map<String, Object>> getData() {
         menuList = new ArrayList<>();

        Map<String, Object> map = new HashMap<>();
        map.put("title", "G1");
        map.put("info", "google 1");
        map.put("img", R.drawable.p1);
        menuList.add(map);

        map = new HashMap<String, Object>();
        map.put("title", "G2");
        map.put("info", "google 2");
        map.put("img", R.drawable.p2);
        menuList.add(map);

        map = new HashMap<String, Object>();
        map.put("title", "G3");
        map.put("info", "google 3");
        map.put("img", R.drawable.p3);
        menuList.add(map);

        return menuList;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.drawermenu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (mDrawerToggle.onOptionsItemSelected(item)) {
            return true;
        }
        switch (item.getItemId()) {
            case R.id.action_search:
                Intent intent = new Intent();
                intent.setAction("android.intent.action.VIEW");
                Uri uri = Uri.parse("http://www.baidu.com");
                intent.setData(uri);
                startActivity(intent);
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        //需要将ActionBarDrawerToggle 与DrawerLayout状态同步
        //将ActionBarDrawerToggle的drawer的图标设置成ActionBar中的home-button的图标
        mDrawerToggle.syncState();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        mDrawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    /* 当我们调用invalidateOptionsMenu()时调用 */
    public boolean onPrepareOptionsMenu(Menu menu) {
        // 当抽屉打开或者隐藏时,加载对应的action items
        boolean isOpen = mDrawerLayout.isDrawerOpen(mDrawerList);
        menu.findItem(R.id.action_search).setVisible(!isOpen);
        return super.onPrepareOptionsMenu(menu);
    }

    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
        Fragment fragment = new DrawerContentFragment();
        Bundle args = new Bundle();
        args.putString("data", menuList.get(i).get("title").toString());
        fragment.setArguments(args);
        FragmentManager fragmentManager = getFragmentManager();
        fragmentManager.beginTransaction().replace(R.id.content_frame, fragment).commit();
        mDrawerList.setItemChecked(i, true);

        mDrawerLayout.closeDrawer(mDrawerList);
    }
}
