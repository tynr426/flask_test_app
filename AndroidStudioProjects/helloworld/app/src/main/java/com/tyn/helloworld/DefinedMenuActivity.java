package com.tyn.helloworld;

import android.app.Activity;
import android.os.Bundle;
import android.os.PersistableBundle;
import android.support.v4.app.FragmentActivity;

/**
 * Created by apple on 16/9/6.
 */
public class DefinedMenuActivity extends FragmentActivity {
    private DefinedMenu definedMenu;
    private RightMenuFragment rightMenuFragment;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        definedMenu=new DefinedMenu(this);
        setContentView(definedMenu);
        rightMenuFragment=new RightMenuFragment();
        getSupportFragmentManager().beginTransaction().add(DefinedMenu.RIGHT_ID,rightMenuFragment).commit();
    }
}
