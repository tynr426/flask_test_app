package com.tyn.helloworld;

/**
 * Created by apple on 16/9/3.
 */
public class CellData{
    private String title;
    private String content;
    public CellData(String title,String content){
        this.title=title;
        this.content=content;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }
}
