package com.tyn.helloworld;


import android.os.Bundle;
import android.os.SystemClock;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;


/**
 * A simple {@link Fragment} subclass.
 */
public class RightMenuFragment extends Fragment {


    public RightMenuFragment() {
        // Required empty public constructor
    }


    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        final View root=inflater.inflate(R.layout.fragment_right_menu,container,false);
        root.findViewById(R.id.btnLoginOut).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                System.out.println("已经注销");
                Toast.makeText(container.getContext(),"已经注销",Toast.LENGTH_SHORT).show();
            }
        });
        return root;
    }

}
