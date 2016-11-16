package com.tyn.helloworld;

import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/*Fragment 是 Android 中在同一个应用内部用于替换 Activity 界面跳转的机制，她高效灵活
*
* */
public class DrawerContentFragment extends Fragment {
    private TextView textView;
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_drawer_content, container, false);
        textView = (TextView) view.findViewById(R.id.drawerTv);
        String data = getArguments().getString("data");
        textView.setText(data);
        return view;
    }
}
