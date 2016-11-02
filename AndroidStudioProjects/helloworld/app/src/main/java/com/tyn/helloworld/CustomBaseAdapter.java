package com.tyn.helloworld;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

/**
 * Created by apple on 16/11/1.
 * 自定义适配器
 */
public class CustomBaseAdapter extends BaseAdapter {
    private List<Map<String, Object>> mData;
    private LayoutInflater mInflater;

    public CustomBaseAdapter(Context context, List<Map<String, Object>> mData) {
        this.mData = mData;
        //对于一个没有被载入或者想要动态载入的界面，都需要使用LayoutInflater.inflate()来载入
        this.mInflater = LayoutInflater.from(context);
    }

    public void setCallBack(MyCallBack _callBack) {
        callBack = _callBack;
    }

    @Override
    public int getCount() {
        // TODO Auto-generated method stub
        return mData.size();
    }

    @Override
    public Object getItem(int arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public long getItemId(int arg0) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {

        ViewHolder holder = null;
        if (convertView == null) {

            holder = new ViewHolder();

            convertView = mInflater.inflate(R.layout.vlist, null);
            holder.img = (ImageView) convertView.findViewById(R.id.img);
            holder.title = (TextView) convertView.findViewById(R.id.title);
            holder.info = (TextView) convertView.findViewById(R.id.info);
            holder.viewBtn = (Button) convertView.findViewById(R.id.view_btn);
            convertView.setTag(holder);

        } else {

            holder = (ViewHolder) convertView.getTag();
        }


        holder.img.setBackgroundResource((Integer) mData.get(position).get("img"));
        holder.title.setText((String) mData.get(position).get("title"));
        holder.info.setText((String) mData.get(position).get("info"));

        holder.viewBtn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {
                if (callBack != null) {

                    callBack.onBtnClink((String) mData.get(position).get("title"),
                            (String) mData.get(position).get("info")
                    );
                }
            }
        });


        return convertView;
    }

    private MyCallBack callBack = null;

    //回调接口
    public interface MyCallBack {
        void onBtnClink(String title, String info);
    }

    public class ViewHolder {
        public ImageView img;
        public TextView title;
        public TextView info;
        public Button viewBtn;
    }

}
