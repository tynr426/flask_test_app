package com.tyn.helloworld;

import android.os.Bundle;
import android.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;


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
