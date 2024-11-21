export const inviteUserToBoardSocket = (socket) => {
  socket.on('FE_USER_INVITED_TO_BOARD', invitation => {
    //Cách Làm nhanh & đơn giản nhất: Exit ngược lại một sự kiện về cho mọi client khác (ngoại trừ chính cái thằng gửi request lên), rồi đề phía FE check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}