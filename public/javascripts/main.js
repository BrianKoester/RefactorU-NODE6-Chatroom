$(function(){

	// connect the socket.io server
	var socket = io.connect('http://localhost')


	// add message to 'room' 
	socket.on('message', function(message){
		$('#room').append('<div>'+message+'</div>');
    });
	

	// attach events - accept message from 'return key' event
	$('#message-input').on('keyup', function(e){
        $el = $(this)

        if(e.which === 13){
                socket.emit('message', $el.val())
                $el.val('')
        }
    });

});
