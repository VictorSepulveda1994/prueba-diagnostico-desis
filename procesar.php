<?php
// procesar.php
require 'conexion.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Error desconocido.'];

try {
    // Validar que los datos existan (validación básica del lado del servidor)
    $codigo = $_POST['codigo'] ?? '';
    if (empty($codigo)) {
        $response['message'] = 'El código es obligatorio.';
        echo json_encode($response);
        exit;
    }

    // 1. Verificar unicidad del código 
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM productos WHERE codigo_producto = ?");
    $stmt->execute([$codigo]);
    if ($stmt->fetchColumn() > 0) {
        $response['message'] = "El código del producto ya está registrado."; // Mensaje de error personalizado 
        echo json_encode($response);
        exit;
    }

    // Iniciar transacción
    $pdo->beginTransaction();

    // 2. Insertar en la tabla `productos`
    $sql = "INSERT INTO productos (codigo_producto, nombre_producto, id_sucursal, id_moneda, precio, descripcion) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $_POST['codigo'],
        $_POST['nombre'],
        $_POST['sucursal'],
        $_POST['moneda'],
        $_POST['precio'],
        $_POST['descripcion']
    ]);

    // Obtener el ID del producto recién insertado
    $id_producto = $pdo->lastInsertId();

    // 3. Insertar en la tabla `producto_materiales`
    $materiales = $_POST['materiales'] ?? [];
    if (!empty($materiales) && is_array($materiales)) {
        $sql_material = "INSERT INTO producto_materiales (id_producto, id_material) VALUES (?, ?)";
        $stmt_material = $pdo->prepare($sql_material);
        foreach ($materiales as $id_material) {
            $stmt_material->execute([$id_producto, $id_material]);
        }
    }
    
    // Si todo fue bien, confirmar la transacción
    $pdo->commit();

    $response['success'] = true;
    $response['message'] = '¡Producto registrado exitosamente!';

} catch (PDOException $e) {
    // Si algo falla, revertir la transacción
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    $response['message'] = 'Error al guardar en la base de datos: ' . $e->getMessage();
}

echo json_encode($response);
?>