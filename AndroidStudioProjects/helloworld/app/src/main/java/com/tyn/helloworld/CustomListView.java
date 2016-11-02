package com.tyn.helloworld;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.os.Bundle;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by apple on 16/10/31.
 * 抽屉之自定义适配器
 */

public class CustomListView extends Activity {
    private android.support.v4.widget.DrawerLayout mDrawerLayout;
    private ListView mDrawerList;
    private List<Map<String, Object>> mData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mData = getData();
        CustomBaseAdapter adapter = new CustomBaseAdapter(this, mData);
        adapter.setCallBack(new CustomBaseAdapter.MyCallBack() {
            @Override
            public void onBtnClink(String title, String info) {
                showInfo(title, info);
            }
        });
        setContentView(R.layout.activity_drawer_layout);
        mDrawerLayout = (android.support.v4.widget.DrawerLayout) findViewById(R.id.draw_layout);
        mDrawerList = (ListView) findViewById(R.id.left_drawer);
        mDrawerList.setAdapter(adapter);
    }

    private List<Map<String, Object>> getData() {
        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("title", "G1");
        map.put("info", "google 1");
        map.put("img", R.drawable.p1);
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("title", "G2");
        map.put("info", "google 2");
        map.put("img", R.drawable.p2);
        list.add(map);

        map = new HashMap<String, Object>();
        map.put("title", "G3");
        map.put("info", "google 3");
        map.put("img", R.drawable.p3);
        list.add(map);

        return list;
    }


    /**
     * 回调方法
     */
    public void showInfo(String title, String info) {
        Fragment fragment = new DrawerContentFragment();
        Bundle args = new Bundle();
        args.putString("data", title+info);
        fragment.setArguments(args);
        FragmentManager fragmentManager = getFragmentManager();
        fragmentManager.beginTransaction().replace(R.id.content_frame, fragment).commit();
        mDrawerLayout.closeDrawer(mDrawerList);

    }

}
