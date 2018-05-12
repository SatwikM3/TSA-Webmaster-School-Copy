$('#range').on("change", function() {
    $('.output').val(this.value +",000  $" );
    }).trigger("change");