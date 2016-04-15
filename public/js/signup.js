$(function() {
    
    $('.ui.form')
      .form({
        fields: {
          login     : 'empty',
          password  : 'minLength[5]',
          password2 : ['empty', 'match[password]'],
          email     : 'email'
        }
      })
    ;
    
})