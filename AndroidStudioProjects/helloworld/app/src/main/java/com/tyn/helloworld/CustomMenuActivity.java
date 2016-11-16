package com.tyn.helloworld;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;

/**
 * Created by apple on 16/9/6.
 */
public class CustomMenuActivity extends FragmentActivity {
    private CustomMenuLayout definedMenu;
    private RightMenuFragment rightMenuFragment;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        definedMenu=new CustomMenuLayout(this);
        setContentView(definedMenu);
        rightMenuFragment=new RightMenuFragment();
        getSupportFragmentManager().beginTransaction().add(CustomMenuLayout.RIGHT_ID,rightMenuFragment).commit();
    }
}
