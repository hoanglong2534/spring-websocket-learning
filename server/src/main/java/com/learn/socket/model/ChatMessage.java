package com.learn.socket.model;

import com.learn.socket.enums.MessageTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

    private String sender;
    private MessageTypeEnum type;
    private String content;

}
