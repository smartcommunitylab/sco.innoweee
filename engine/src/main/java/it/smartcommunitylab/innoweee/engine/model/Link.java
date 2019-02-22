package it.smartcommunitylab.innoweee.engine.model;

public class Link {
	private String name;
	private String link;
	private String type;
	private String previewUri;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLink() {
		return link;
	}
	public void setLink(String link) {
		this.link = link;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getPreviewUri() {
		return previewUri;
	}
	public void setPreviewUri(String previewUri) {
		this.previewUri = previewUri;
	}
}
