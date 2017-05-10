'use strict';

app.controller('conseillerCtrl', function($scope, $location, $rootScope, chatsFactory, userFactory){
  $scope.user={}
  $scope.user.password != '';
  $scope.user.passwordConfirm != '';

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    $rootScope.socket=io.connect('http://localhost:8080');
  else {
    $rootScope.socket=io.connect('https://projetinfo.merchez.com');
  }

  switch($location.path()){
    case '/conseiler/':
    case '/conseiler/moncompte':
        $scope.active=0;
      break;
    case '/conseiller/historique':
        $scope.active=1;
      break;
    default:
        $scope.active=0;
      break;
  }

  $scope.chats=chatsFactory.get();

  userFactory.get().then(function(reponse){
    $scope.user = reponse;
    $scope.user.password = '';
    $scope.user.passwordConfirm = '';

    $rootScope.socket.emit('conseillerConnexion', {groupe: $scope.user.groupe});
  });

  $scope.updateUser = function(){
    console.log($scope.user);
    userFactory.update($scope.user);
  }

  $scope.changeRoute=function(route){
     $location.path(route);
  }

  $rootScope.socket.on('needConseiller', function(data){
    swal({
      title: "Nouvelle utilisateur",
      text: "Un utilisateur a besoin d'aide !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Accepter",
      cancelButtonText: "Refuser",
      closeOnConfirm: false,
      closeOnCancel: false
    },
    function(isConfirm){
      if (isConfirm) {
        $rootScope.socket.emit('conseillerJoinRoom', { user: $scope.user, entrepriseId: data.entrepriseId, emailClient: data.emailClient});
        swal.close();
        $rootScope.socket.emit('closeSwal', {emailClient: data.emailClient, groupe: $scope.user.groupe});
      }
    });
  });

  $rootScope.socket.on('closeSwal', function(){
    swal.close();
  })

  $rootScope.socket.on('message', function(data){
    chatsFactory.addMessage(data.chatId, data.message, 0);
    $scope.$apply(function () {
      $scope.chat=chatsFactory.getById(data.chatId);
    });
  });

  $rootScope.socket.on('user_leave', function(data){
    chatsFactory.addMessage(data.chatId, "--- L'utilisateur s'est déconnecté. ---", 0);
    chatsFactory.endChat(data.chatId);
    $rootScope.socket.emit('endChat', data.chatId);
    $scope.$apply(function () {
      $scope.chat=chatsFactory.getById(data.chatId);
    });
  });

  $rootScope.socket.on('createChat', function(data){
    console.log(data);
    data.nonlu=0;
    chatsFactory.add(data);
    $scope.$apply(function () {
      $scope.chat=chatsFactory.getById(data.id);
    });
  });

});

app.controller('chatCtrl', function($scope, $route, $rootScope, chatsFactory, userFactory){
  $scope.id = $route.current.params.id;

  $scope.user = userFactory.get();
  $scope.chat=chatsFactory.getById($scope.id);

  $scope.chat.nonlu=0;

  $scope.sendMessage = function(message){
    chatsFactory.sendMessage($scope.id, message, 1);
    $rootScope.socket.emit('message', {chatId: $scope.chat.id,  user: $scope.user, message: message, emailClient: $scope.chat.emailClient});
    $scope.inputMessage = "";
  }



    $scope.startVoiceChat = function(){
      // State
      var me = {};
      var myStream;
      var peers = {};
      var call = {};

      $.get('/peer/new', function(data){
        console.log(data);
        console.log("test");
        // Handle prefixed versions
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

        call = data.call;

        init();
      });



      // Start everything up
      function init() {
        console.log("test");
        if (!navigator.getUserMedia) return unsupported();

        getLocalAudioStream(function(err, stream) {
          if (err || !stream) return;

          connectToPeerJS(function(err) {
            if (err) return;

            registerIdWithServer(me.id);
            if (call.peers.length) callPeers();
            else displayShareMessage();
          });
        });
      }

      // Connect to PeerJS and get an ID
      function connectToPeerJS(cb) {
        display('Connecting to PeerJS...');
        me = new Peer({key: 'dewpt2r4rpddvx6r'});

        me.on('call', handleIncomingCall);

        me.on('open', function() {
          display('Connected.');
          display('ID: ' + me.id);
          cb && cb(null, me);
        });

        me.on('error', function(err) {
          display(err);
          cb && cb(err);
        });
      }

      // Add our ID to the list of PeerJS IDs for this call
      function registerIdWithServer() {
        console.log(call);
        display('Registering ID with server...');
        $.post('/peer/' + call.id + '/addpeer/' + me.id);
      }

      // Remove our ID from the call's list of IDs
      function unregisterIdWithServer() {
        $.post('/peer/' + call.id + '/removepeer/' + me.id);
      }

      // Call each of the peer IDs using PeerJS
      function callPeers() {
        call.peers.forEach(callPeer);
      }

      function callPeer(peerId) {
        display('Calling ' + peerId + '...');
        var peer = getPeer(peerId);
        peer.outgoing = me.call(peerId, myStream);

        peer.outgoing.on('error', function(err) {
          display(err);
        });

        peer.outgoing.on('stream', function(stream) {
          display('Connected to ' + peerId + '.');
          addIncomingStream(peer, stream);
        });
      }

      // When someone initiates a call via PeerJS
      function handleIncomingCall(incoming) {
        display('Answering incoming call from ' + incoming.peer);
        var peer = getPeer(incoming.peer);
        peer.incoming = incoming;
        incoming.answer(myStream);
        peer.incoming.on('stream', function(stream) {
          addIncomingStream(peer, stream);
        });
      }

      // Add the new audio stream. Either from an incoming call, or
      // from the response to one of our outgoing calls
      function addIncomingStream(peer, stream) {
        display('Adding incoming stream from ' + peer.id);
        peer.incomingStream = stream;
        playStream(stream);
      }

      // Create an <audio> element to play the audio stream
      function playStream(stream) {
        var audio = $('<audio autoplay />').appendTo('body');
        audio[0].src = (URL || webkitURL || mozURL).createObjectURL(stream);
      }

      // Get access to the microphone
      function getLocalAudioStream(cb) {
        display('Trying to access your microphone. Please click "Allow".');

        navigator.getUserMedia (
          {video: false, audio: true},

          function success(audioStream) {
            display('Microphone is open.');
            var myStream = audioStream;
            if (cb) cb(null, myStream);
          },

          function error(err) {
            display('Couldn\'t connect to microphone. Reload the page to try again.');
            if (cb) cb(err);
          }
        );
      }

      ////////////////////////////////////
      // Helper functions
      function getPeer(peerId) {
        return peers[peerId] || (peers[peerId] = {id: peerId});
      }

      function displayShareMessage() {
        display('Give someone this URL to chat.');
        //display('<input type="text" value="' + location.href + '" readonly>');
        display(call);

        $rootScope.socket.emit('callID', { emailClient: $scope.chat.emailClient  ,call: call});
      }

      function unsupported() {
        display("Your browser doesn't support getUserMedia.");
      }

      function display(message) {
        console.log(message);
      }
    }
});

app.controller('historiqueCtrl', function($scope, $route, chatsFactory, historiqueFactory, userFactory){
  /*$scope.resultats = [
    {id:0, date: '01/03/2017', duree: '20 min', note : 7},
    {id:1, date: '01/03/2017', duree: '17 min', note : 5},
    {id:2, date: '02/03/2017', duree: '15 min', note : 2},
  ]*/

  $scope.noteMin=0;
  $scope.noteMax=10;
  $scope.type="";

  historiqueFactory.getMyHistorique().then(function(res){
    $scope.resultats = res;
  });

  $scope.chats=chatsFactory.get();

  // Gestion des DatePicker

  $scope.clearDebut = function() {
    $scope.dateDebut = null;
  };

  $scope.clearFin = function() {
    $scope.dateDebut = null;
  };

  $scope.inlineOptions = {
    minDate: new Date(),
    showWeeks: true
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.format = 'dd/MM/yyyy';

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

});
