jQuery(function($){
	var iframe_made = false;

	$('#iframer').click(function(event){
		event.preventDefault();
		if ( !iframe_made ){
			iframe_made = true;
			var iframe = document.createElement('iframe');
			iframe.setAttribute('src', $(this).prop('href'));
			$('#content').append(iframe);
		}
	})
})