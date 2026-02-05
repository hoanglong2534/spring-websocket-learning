'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');

var stompClient = null;
var username = null;


function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        // Ẩn trang nhập tên, hiện trang chat
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        // Kết nối tới Server WebSocket
        var socket = new SockJS('http://localhost:9000/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    // Đăng ký nhận tin từ kênh Public
    stompClient.subscribe('/topic/public', onMessageReceived);

    // Gửi thông báo JOIN tới server
    stompClient.send("/app/chat/join",
        {},
        JSON.stringify({sender: username, type: 'JOIN'})
    );
}


function onError(error) {
    alert('Không thể kết nối tới Server! Vui lòng kiểm tra lại Backend.');
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();

    if(messageContent && stompClient) {
        var chatMessage = {
            sender: username,
            content: messageInput.value,
            type: 'TEXT'
        };
        
        stompClient.send("/app/chat/send", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
    event.preventDefault();
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' đã tham gia!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' đã rời phòng!';
    } else {
        messageElement.classList.add('chat-message');
        
        var usernameElement = document.createElement('strong');
        usernameElement.classList.add('nickname');
        usernameElement.innerText = message.sender + ": "; 
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('span');
    textElement.innerText = message.content;
    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight; 
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);