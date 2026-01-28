<?php

class Test
{
  public function mergeSortArray(array $a, array $b): array
  {
    $tmpa = [];
    foreach ($a as $v) {
      $tmpa[] = $v;
    }
    foreach ($b as $v) {
      $tmpa[] = $v;
    }

    $this->mergeSort($tmpa, 0, count($tmpa) - 1);
    return $tmpa;
  }

  private function mergeSort(array &$arr, int $left, int $right): void
  {
    if ($left >= $right) {
      return;
    }

    $mid = floor($left + ($right - $left) / 2);
    $this->mergeSort($arr, $left, $mid);
    $this->mergeSort($arr, $mid + 1, $right);
    $this->merge($arr, $left, $mid, $right);
  }

  private function merge(array &$arr, int $left, int $mid, int $right): void
  {
    $n1 = $mid - $left + 1;
    $n2 = $right - $mid;

    $L = [];
    $R = [];

    for ($i = 0; $i < $n1; $i++) {
      $L[$i] = $arr[$left + $i];
    }
    for ($j = 0; $j < $n2; $j++) {
      $R[$j] = $arr[$mid + 1 + $j];
    }

    $i = 0;
    $j = 0;
    $k = $left;

    while ($i < $n1 && $j < $n2) {
      if ($L[$i] <= $R[$j]) {
        $arr[$k] = $L[$i];
        $i++;
      } else {
        $arr[$k] = $R[$j];
        $j++;
      }
      $k++;
    }

    while ($i < $n1) {
      $arr[$k] = $L[$i];
      $i++;
      $k++;
    }

    while ($j < $n2) {
      $arr[$k] = $R[$j];
      $j++;
      $k++;
    }
  }

  public function getMissingData(array $arr): array
  {
    $n = count($arr);
    if ($n < 2) {
      return [];
    }

    $diffs = [];
    for ($i = 1; $i < $n; $i++) {
      $diffs[$i] = $arr[$i] - $arr[$i - 1];
    }

    $values = array_values($diffs);
    $this->mergeSort($values, 0, count($values) - 1);
    $m = count($values);
    $median = ($m % 2 === 1) ? $values[(int)floor($m / 2)] : (($values[$m / 2 - 1] + $values[$m / 2]) / 2);

    $absDev = [];
    foreach ($values as $v) {
      $absDev[] = abs($v - $median);
    }
    $this->mergeSort($absDev, 0, count($absDev) - 1);
    $mad = ($m % 2 === 1) ? $absDev[(int)floor($m / 2)] : (($absDev[$m / 2 - 1] + $absDev[$m / 2]) / 2);
    if ($mad == 0) {
      $mad = 1; // avoid division by zero
    }

    $anomalyIndices = [];
    $threshold = 3 * $mad;
    foreach ($diffs as $idx => $d) {
      $isAnom = abs($d - $median) >= $threshold;
      if ($isAnom) {
        $anomalyIndices[] = $idx; // index of second element in the bad diff
      }
    }

    return $anomalyIndices;
  }

  public function insertMissingData(array $arr, array $missingIndices): array
  {
    if (empty($missingIndices)) {
      return $arr;
    }

    $this->mergeSort($missingIndices, 0, count($missingIndices) - 1);
    $offset = 0;
    foreach ($missingIndices as $idx) {
      $pos = $idx + $offset;
      if ($pos <= 0 || $pos >= count($arr)) {
        continue;
      }
      $prev = $arr[$pos - 1];
      $next = $arr[$pos];
      $insertVal = intdiv($prev + $next, 2);
      array_splice($arr, $pos, 0, [$insertVal]);
      $offset++;
    }

    return $arr;
  }

  public function main()
  {
    $a = array(11, 36, 65, 135, 98);
    $b = array();
    $b[0] = 81;
    $b[1] = 23;
    $b[2] = 50;
    $b[3] = 155;
    $c = $this->mergeSortArray($a, $b);
    echo "Merged and Sorted Array: ";
    foreach ($c as $value) {
      echo $value . " ";
    }
    echo "\n";

    $i = $this->getMissingData($c);
    echo "Anomaly indices: " . json_encode($i) . "\n";

    $d = $this->insertMissingData($c, $i);
    echo "After inserting estimated values: ";
    foreach ($d as $v) {
      echo $v . " ";
    }
    echo "\n";
  }
}

$t = new Test();
$t->main();