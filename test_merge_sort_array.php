<?php
require_once __DIR__ . '/merge_sort_array.php';

function eq($a, $b) {
  return $a == $b;
}

$t = new Test();

$a = array(11, 36, 65, 135, 98);
$b = array(81, 23, 50, 155);

$c = $t->mergeSortArray($a, $b);
$expectedC = [11, 23, 36, 50, 65, 81, 98, 135, 155];
if (!eq($c, $expectedC)) {
  echo "FAIL: merged array mismatch\n";
  echo "Got:   " . json_encode($c) . "\n";
  echo "Want:  " . json_encode($expectedC) . "\n";
  exit(1);
}

$i = $t->getMissingData($c);
$expectedI = [7];
if (!eq($i, $expectedI)) {
  echo "FAIL: anomaly indices mismatch\n";
  echo "Got:   " . json_encode($i) . "\n";
  echo "Want:  " . json_encode($expectedI) . "\n";
  exit(2);
}

$d = $t->insertMissingData($c, $i);
$expectedD = [11, 23, 36, 50, 65, 81, 98, 116, 135, 155];
if (!eq($d, $expectedD)) {
  echo "FAIL: inserted values mismatch\n";
  echo "Got:   " . json_encode($d) . "\n";
  echo "Want:  " . json_encode($expectedD) . "\n";
  exit(3);
}

// Pattern 1: step = 5, missing 20 between 15 and 25
$a1 = [5, 15];
$b1 = [10, 25, 30];
$c1 = $t->mergeSortArray($a1, $b1);
$expectedC1 = [5, 10, 15, 25, 30];
if (!eq($c1, $expectedC1)) {
  echo "FAIL P1: merged array mismatch\n";
  echo "Got:   " . json_encode($c1) . "\n";
  echo "Want:  " . json_encode($expectedC1) . "\n";
  exit(1);
}

$i1 = $t->getMissingData($c1);
$expectedI1 = [3];
if (!eq($i1, $expectedI1)) {
  echo "FAIL P1: anomaly indices mismatch\n";
  echo "Got:   " . json_encode($i1) . "\n";
  echo "Want:  " . json_encode($expectedI1) . "\n";
  exit(2);
}

$d1 = $t->insertMissingData($c1, $i1);
$expectedD1 = [5, 10, 15, 20, 25, 30];
if (!eq($d1, $expectedD1)) {
  echo "FAIL P1: inserted values mismatch\n";
  echo "Got:   " . json_encode($d1) . "\n";
  echo "Want:  " . json_encode($expectedD1) . "\n";
  exit(3);
}

// Pattern 2: step = 3, missing 10 between 7 and 13
$a2 = [1, 7, 16];
$b2 = [4, 13];
$c2 = $t->mergeSortArray($a2, $b2);
$expectedC2 = [1, 4, 7, 13, 16];
if (!eq($c2, $expectedC2)) {
  echo "FAIL P2: merged array mismatch\n";
  echo "Got:   " . json_encode($c2) . "\n";
  echo "Want:  " . json_encode($expectedC2) . "\n";
  exit(4);
}

$i2 = $t->getMissingData($c2);
$expectedI2 = [3];
if (!eq($i2, $expectedI2)) {
  echo "FAIL P2: anomaly indices mismatch\n";
  echo "Got:   " . json_encode($i2) . "\n";
  echo "Want:  " . json_encode($expectedI2) . "\n";
  exit(5);
}

$d2 = $t->insertMissingData($c2, $i2);
$expectedD2 = [1, 4, 7, 10, 13, 16];
if (!eq($d2, $expectedD2)) {
  echo "FAIL P2: inserted values mismatch\n";
  echo "Got:   " . json_encode($d2) . "\n";
  echo "Want:  " . json_encode($expectedD2) . "\n";
  exit(6);
}

echo "PASS: all tests\n";
exit(0);
