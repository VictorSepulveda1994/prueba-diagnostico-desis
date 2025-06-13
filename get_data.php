<?php
// get_data.php
require 'conexion.php';
header('Content-Type: application/json');

$list = $_GET['list'] ?? '';
$bodega_id = $_GET['bodega_id'] ?? 0;

$data = [];

try {
    if ($list === 'bodegas') {
        $stmt = $pdo->query("SELECT id_bodega as id, nombre_bodega as nombre FROM bodegas ORDER BY nombre_bodega");
        $data = $stmt->fetchAll();
    } elseif ($list === 'sucursales' && $bodega_id > 0) {
        $stmt = $pdo->prepare("SELECT id_sucursal as id, nombre_sucursal as nombre FROM sucursales WHERE id_bodega = ? ORDER BY nombre_sucursal");
        $stmt->execute([$bodega_id]);
        $data = $stmt->fetchAll();
    } elseif ($list === 'monedas') {
        $stmt = $pdo->query("SELECT id_moneda as id, nombre_moneda as nombre FROM monedas ORDER BY nombre_moneda");
        $data = $stmt->fetchAll();
    } elseif ($list === 'materiales') {
        $stmt = $pdo->query("SELECT id_material as id, nombre_material as nombre FROM materiales ORDER BY nombre_material");
        $data = $stmt->fetchAll();
    }
} catch (PDOException $e) {
    // En un entorno real, es mejor registrar este error.
    http_response_code(500);
    echo json_encode(['error' => 'Error en la base de datos: ' . $e->getMessage()]);
    exit;
}

echo json_encode($data);
?>