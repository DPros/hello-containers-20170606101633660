<html>
<head>
	<title>Website Title</title>
    
	<meta property="og:url"           content="http://www.your-domain.com/your-page.html" />
	<meta property="og:type"          content="website" />
	<meta property="og:title"         content="Website Title" />
	<meta property="og:description"   content="button for content share" />
	<meta property="og:image"         content="http://www.your-domain.com/path/image.jpg" />
</head>
<body>


	<div id="fb-root"></div>
	<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>

	
	<div class="fb-share-button" 
		data-href="http://www.your-domain.com/your-page.html" 
		data-layout="button_count">
	</div>

</body>
</html>
