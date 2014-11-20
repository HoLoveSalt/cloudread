/**
 * 过滤图集和视频然后显示正文
 * @author shiyangyang
 */
define("txt",function(require){
	return function(args){
		var content = args.content,
			data = args.data,
			comment = "";
	if(args.data.comment){
		if(!args.data.commentUserImg){ args.data.commentUserImg="images/commentUser.png";}
		if(!args.data.commentUrl){ args.data.commentUrl="javascript:void(0)"; }
		if(args.data.commentUserLink){ args.data.commentUserLink = "<a href='"+args.data.commentUserLink+"' target='_blank' class='commentUserLink'>"; }else{args.data.commentUserLink = ''}
		if(args.data.commentUserName){ args.data.commentUserName = "---"+args.data.commentUserName; }else{
			args.data.commentUserName = "";
		}
		comment = "<table class='m-txt-comment'><tr>"+
					"<td class='m-txt-commentImgs' style=''>"+args.data.commentUserLink+
						"<img src='"+args.data.commentUserImg+"' class='m-txt-commentUserImg' >"+"</a>"+
						"<img src='images/comment.png' class='commentLogo' >"+
					"</td>"+
					"<td class='m-txt-commentText '>"+
						"<a href='"+args.data.commentUrl+"'target='_blank' class='commentTextLink'>"+args.data.comment+"<span class='m-txt-commentUserName'>"+args.data.commentUserName+"</span></a>"+
					"</td>"+
				"</tr></table>";
		}
		content.html( 
			comment+data.txt
				.replace(/<div[^<]+(\"ui\-gallery).*?<\/div>/g,'')
				.replace(/<embed(.*?)>/g,'') 
		);
	}
});