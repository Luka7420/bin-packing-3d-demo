<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit;
}

echo json_encode([
  "load_plan_id" => "LP-2026-01-22-001",
  "summary" => [
    "total_items_loaded" => 5,
    "total_items_unloaded" => 2,
    "utilization" => [
      "volume_percentage" => 6.95,
      "weight_percentage" => 4.21,
      "linear_meters_occupied" => 2.8
    ]
  ],
  "container" => [
    "type" => "40HC",
    "max_weight_kg" => 28500,
    "max_volume_m3" => 76.2,
    "dimensions_cm" => [
      "length" => 1202,
      "width" => 235,
      "height" => 270
    ]
  ],
  "placed_items" => [
    [
      "item_id" => "PALLET-A1",
      "client_name" => "IKEA Serbia",
      "description" => "Furniture Components",
      "weight_kg" => 450,
      "position_cm" => [ "x" => 0, "y" => 0, "z" => 0 ],
      "dimensions_cm" => [ "length" => 120, "width" => 80, "height" => 220 ],
      "rotation" => [ "is_rotated" => false ],
      "load_order" => 1
    ],
    [
      "item_id" => "BOX-B4",
      "client_name" => "Hemofarm Vrsac",
      "description" => "Pharma Packaging",
      "weight_kg" => 25,
      "position_cm" => [ "x" => 120, "y" => 0, "z" => 0 ],
      "dimensions_cm" => [ "length" => 60, "width" => 40, "height" => 50 ],
      "rotation" => [ "is_rotated" => true ],
      "load_order" => 2
    ],
    [
      "item_id" => "PALLET-E5",
      "client_name" => "Bambi Pozarevac",
      "description" => "Confectionery (Plazma)",
      "weight_kg" => 300,
      "position_cm" => [ "x" => 180, "y" => 0, "z" => 0 ],
      "dimensions_cm" => [ "length" => 120, "width" => 80, "height" => 140 ],
      "rotation" => [ "is_rotated" => false ],
      "load_order" => 3
    ],
    [
      "item_id" => "PALLET-F6",
      "client_name" => "Nectar Backa Palanka",
      "description" => "Fruit Juice Conc.",
      "weight_kg" => 250,
      "position_cm" => [ "x" => 180, "y" => 0, "z" => 140 ],
      "dimensions_cm" => [ "length" => 120, "width" => 80, "height" => 100 ],
      "rotation" => [ "is_rotated" => false ],
      "load_order" => 4
    ],
    [
      "item_id" => "APP-G7",
      "client_name" => "Gorenje Valjevo",
      "description" => "Refrigeration Unit",
      "weight_kg" => 175,
      "position_cm" => [ "x" => 300, "y" => 0, "z" => 0 ],
      "dimensions_cm" => [ "length" => 65, "width" => 65, "height" => 180 ],
      "rotation" => [ "is_rotated" => true ],
      "load_order" => 5
    ]
  ],
  "unplanned_items" => [
    [
      "item_id" => "PALLET-C9",
      "client_name" => "Metalac Gornji Milanovac",
      "description" => "Heavy Cookware",
      "weight_kg" => 1500,
      "reason" => "weight_limit_exceeded"
    ],
    [
      "item_id" => "TUBE-H8",
      "client_name" => "Philip Morris Nis",
      "description" => "Promotional Displays",
      "weight_kg" => 120,
      "dimensions_cm" => [ "length" => 400, "width" => 60, "height" => 60 ],
      "reason" => "item_too_long_for_remaining_gap"
    ]
  ]
]);
