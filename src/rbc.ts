class Calculator {
  depth: number;
  bottom_time: number;
  ascent_rate: number;
  air_share: boolean;
  sac: number;
  sac_diver_2: number;
  cylinder_size: number;
  safety_stop: boolean;
  ss_depth: number;
  ss_duration: number;

  constructor() {
    const select = (<HTMLSelectElement>document.getElementById("cylinder-size"));

    this.depth = (<HTMLInputElement>document.getElementById("depth")).valueAsNumber;
    this.bottom_time = (<HTMLInputElement>document.getElementById("bottom-time")).valueAsNumber;
    this.ascent_rate = (<HTMLInputElement>document.getElementById("ascent-rate")).valueAsNumber;
    this.air_share = (<HTMLInputElement>document.getElementById("with-air-share")).checked;
    this.sac = (<HTMLInputElement>document.getElementById("sac")).valueAsNumber;
    this.sac_diver_2 =
      this.air_share ? (<HTMLInputElement>document.getElementById("sac-diver-2")).valueAsNumber : 0;
    this.cylinder_size = parseInt(select.options[select.selectedIndex].value);
    this.safety_stop = (<HTMLInputElement>document.getElementById("with-safety-stop")).checked;
    this.ss_depth =
      this.safety_stop ? (<HTMLInputElement>document.getElementById("safety-stop-depth")).valueAsNumber : 0;
    this.ss_duration =
      this.safety_stop ? (<HTMLInputElement>document.getElementById("safety-stop-duration")).valueAsNumber : 0;
  }

  bottom_time_consumption(): number {
    return depth_consumption(this.depth, this.bottom_time, this.sac, this.sac_diver_2);
  }

  safety_stop_consumption(): number {
    const stop_consumption = depth_consumption(
      this.ss_depth, this.ss_duration, this.sac, this.sac_diver_2);
    const travel_consumption = depth_consumption(
      this.ss_depth / 2, this.ss_depth / this.ascent_rate, this.sac, this.sac_diver_2);

    return stop_consumption + travel_consumption;
  }

  travel_consumption(): number {
    const target_depth = this.safety_stop ? this.ss_depth : 0;
    const travel_distance = this.depth - target_depth;
    const average_depth = (travel_distance / 2) + target_depth;
    const duration = travel_distance / this.ascent_rate;

    return depth_consumption(average_depth, duration, this.sac, this.sac_diver_2);
  }

  calculate_consumption(): number {
    return Math.round(
      this.bottom_time_consumption() + this.safety_stop_consumption() + this.travel_consumption());
  }

  run(): void {
    const pre = document.getElementById("result");

    const gas = this.calculate_consumption();
    console.log(this.cylinder_size);
    const bars = calculate_bars(gas, this.cylinder_size);
    pre.innerText = `${gas} L (${bars} bar)`;

    pre.classList.remove("is-hidden");
  }
}

export function depth_consumption(depth: number, duration: number, sac1: number, sac2: number): number {
  const ata = depth_to_ata(depth);
  return duration * (sac1 * ata) + duration * (sac2 * ata);
}

export function depth_to_ata(depth: number): number {
  if (depth >= 0) {
    return depth / 10 + 1;
  } else {
    return NaN;
  }
}

export function calculate_bars(litres: number, cylinder_size: number): number {
  if (litres >= 0 && cylinder_size >= 0) {
    return Math.round(litres / cylinder_size);
  } else {
    return NaN;
  }
}

function updateAirShare(): void {
  const checkbox = (<HTMLInputElement>document.getElementById("with-air-share"));
  const input = (<HTMLInputElement>document.getElementById("form-diver-2-sac"));

  if (checkbox.checked) {
    input.classList.remove("is-hidden");
  } else {
    input.classList.add("is-hidden");
  }
}

function updateSafetyStop(): void {
  const checkbox = (<HTMLInputElement>document.getElementById("with-safety-stop"));
  const row = document.getElementById("safety-stop-form-elements");

  if (checkbox.checked) {
    row.classList.remove("is-hidden");
  } else {
    row.classList.add("is-hidden");
  }
}

function updateSafetyStopDuration(): void {
  if ((<HTMLInputElement>document.getElementById("with-safety-stop")).checked) {
    (<HTMLInputElement>document.getElementById("safety-stop-duration")).value =
      String((<HTMLInputElement>document.getElementById("depth")).valueAsNumber >= 30 ? 5 : 3);
  }
}

function init(): void {
  document.getElementById("calculate-btn").addEventListener("click", () => {
    const calc = new Calculator();
    calc.run();
  });

  document.getElementById("with-safety-stop").addEventListener("click", updateSafetyStop);
  document.getElementById("depth").addEventListener("change", updateSafetyStopDuration);
  document.getElementById("with-air-share").addEventListener("click", updateAirShare);

  updateAirShare();
  updateSafetyStop();
  updateSafetyStopDuration();
}

document.addEventListener('DOMContentLoaded', init);
