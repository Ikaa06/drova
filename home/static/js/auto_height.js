function setEqualHeight(columns)
{
var tallestcolumn = 0;
columns.each(
function()
{
currentHeight = $(this).height();
if(currentHeight > tallestcolumn)
{
tallestcolumn = currentHeight;
}
}
);
columns.height(tallestcolumn);
}

$(window).load(function() {
setEqualHeight($(".blocklist-3 .text"));
setEqualHeight($(".blocklist-23 .text"));
});