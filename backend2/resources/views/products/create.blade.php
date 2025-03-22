<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<h1>Create a Product</h1>
    <form action="{{route('product.store')}}" method="post">
        @csrf
        @method('post')
        <label for="name">Name:</label>
        <input type="text" name="name" placeholder="name"/><br><br>
        
        <label for="qty">Quantity:</label>
        <input type="text" name="qty" placeholder="qty"/><br><br>
        
        <label for="price">Price:</label>
        <input type="text" name="price" placeholder="price"/><br><br>
        
        <label for="description">Description:</label>
        <input type="text" name="description" placeholder="description"/><br><br>
        
        <input type="submit" value="Create Product"/>
    </form>
</body>
</html>