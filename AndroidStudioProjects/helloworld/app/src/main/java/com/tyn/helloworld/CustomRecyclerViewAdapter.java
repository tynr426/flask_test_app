package com.tyn.helloworld;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Created by apple on 16/9/3.
 * 自定义RecyclerView 的适配器

 */
public class CustomRecyclerViewAdapter extends RecyclerView.Adapter {
    private CellData[] data;
    public CustomRecyclerViewAdapter(CellData[] data){
        this.data=data;
    }
    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.mOnItemClickListener = onItemClickListener;
    }

    public interface OnItemClickListener
    {
        void onItemClick(View view, int position);
    }
    private OnItemClickListener mOnItemClickListener;
    class CustomViewHolder extends RecyclerView.ViewHolder {
        private TextView tvTitle;
        private TextView tvContent;

        public CustomViewHolder(View root) {
            super(root);
            tvTitle = (TextView) root.findViewById(R.id.tvTitle);
            tvContent = (TextView) root.findViewById(R.id.tvContent);
        }

        public TextView getTvTitle() {
            return tvTitle;
        }

        public TextView getTvContent() {
            return tvContent;
        }


    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
//        return new CustomViewHolder(new TextView(parent.getContext()));
        //使用资源文件自定义列表项,用布局解析器来解析一个布局
        return new CustomViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.list_cell, null));
    }

    @Override
    public void onBindViewHolder(final RecyclerView.ViewHolder holder, final int position) {
        CustomViewHolder vh = (CustomViewHolder) holder;
        CellData cellData = data[position];
        vh.getTvTitle().setText(cellData.getTitle());
        vh.getTvContent().setText(cellData.getContent());
        if (mOnItemClickListener != null)
        {
            holder.itemView.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                    mOnItemClickListener.onItemClick(holder.itemView, position);
                }
            });

        }
    }

    @Override
    public int getItemCount() {
        return data.length;
    }


}

