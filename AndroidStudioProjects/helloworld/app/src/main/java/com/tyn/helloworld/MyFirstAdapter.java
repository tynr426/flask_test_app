package com.tyn.helloworld;

import android.support.v4.view.LayoutInflaterFactory;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

/**
 * Created by apple on 16/9/3.
 */
public class MyFirstAdapter extends RecyclerView.Adapter {
    public void setmOnItemClickLitener(OnItemClickLitener mOnItemClickLitener) {
        this.mOnItemClickLitener = mOnItemClickLitener;
    }

    public interface OnItemClickLitener
    {
        void onItemClick(View view, int position);
    }
    private OnItemClickLitener mOnItemClickLitener;
    class DefinedViewHolder extends RecyclerView.ViewHolder {
        private TextView tvTitle;
        private TextView tvContent;

        public DefinedViewHolder(View root) {
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
//        return new DefinedViewHolder(new TextView(parent.getContext()));
        return new DefinedViewHolder(LayoutInflater.from(parent.getContext()).inflate(R.layout.list_cell, null));
    }

    @Override
    public void onBindViewHolder(final RecyclerView.ViewHolder holder, final int position) {
        DefinedViewHolder vh = (DefinedViewHolder) holder;
        CellData cellData = data[position];
        vh.getTvTitle().setText(cellData.getTitle());
        vh.getTvContent().setText(cellData.getContent());
        if (mOnItemClickLitener != null)
        {
            holder.itemView.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                    mOnItemClickLitener.onItemClick(holder.itemView, position);
                }
            });

        }
    }

    @Override
    public int getItemCount() {
        return data.length;
    }

    private CellData[] data = new CellData[]{
            new CellData("今日头条", "全是爆炸性的"),
            new CellData("新歌曲推荐", "来吧来吧"),
            new CellData("科技行业", "全是爆炸性的"),
            new CellData("全球五百强", "来吧来吧"),
            new CellData("理财行业", "全是爆炸性的"),
            new CellData("IT行业", "来吧来吧"),
            new CellData("金融行业", "全是爆炸性的"),
            new CellData("娱乐行业", "来吧来吧")
    };
}

