package aus.web.utils;

import java.util.List;

public class PageInfo<T> {
	private int pageSize;
	private int pageIndex;
	private int count;
	private List<T> list;
	
	public int getPageSize() {
		return pageSize;
	}
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}
	public int getPageIndex() {
		return pageIndex;
	}
	public void setPageIndex(int pageIndex) {
		this.pageIndex = pageIndex;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public int getPageCount(){
		if(count%pageSize==0){
			return count/pageSize;
		}else {
			return count/pageSize+1;
		}
	}
	public int getBegin(){
		return (pageIndex-1)*pageSize;
	}
	public List<T> getList() {
		return list;
	}
	public void setList(List<T> list) {
		this.list = list;
	}
	
}
