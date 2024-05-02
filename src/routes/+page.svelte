<script>
	import "../app.css";
	let physicalBase = '';
	let virtualBounds = '';
	let physicalBounds = '';
	let MIN_VA = 0;
	let MIN_PA = 0;
	let prevProcNUM = -1;
	let PIDarr = [];
	let colorIndex = 0;
	const colors = ['bg-amber-300', 'bg-lime-400', 'bg-pink-400'];

	let rPID = 0;
	let rPID_base = 0;
	let rPID_bounds = 0;
	let rPID_VA = 0;
	let rPID_PA = 0;

	class PID {
		constructor(physicalBase, virtualBounds) {
			this.p_base = physicalBase;
			this.v_bounds = virtualBounds;
			this.p_bounds = physicalBase + virtualBounds;

			const overlapsExisting = PIDarr.some(
				(pid) =>
					(this.p_base >= pid.p_base && this.p_base <= pid.p_bounds) ||
					(this.p_bounds >= pid.p_base && this.p_bounds <= pid.p_bounds) ||
					(this.p_base <= pid.p_base && this.p_bounds >= pid.p_bounds)
			);

			//if (!overlapsExisting) {
				if (this.v_bounds > MIN_VA) {
					MIN_VA = Math.ceil(Math.log2(this.v_bounds));
				}
				if (this.p_bounds > MIN_PA) {
					MIN_PA = Math.ceil(Math.log2(this.p_bounds));
				}
				this.proc_num = prevProcNUM + 1;
				prevProcNUM++;
				PIDarr.push(this);
				console.log(this.p_base);
				console.log(this.v_bounds);
				console.log(this.p_bounds);
				console.log(MIN_PA);
				console.log(MIN_VA);

				const containerWidth = document.getElementById('pid-container').offsetWidth;
				const maxBoxes = 10;
				const boxWidth = containerWidth / maxBoxes - 5;
				const actualBoxWidth = Math.min(boxWidth, containerWidth);
				const position = 92 + actualBoxWidth * PIDarr.length;

				const PIDBox = document.createElement('button');
				PIDBox.className =
					'pid-box absolute text-black font-mono mt-2 w-20 h-20 flex justify-center items-center rounded-md';
				PIDBox.classList.add(colors[colorIndex]);
				colorIndex = (colorIndex + 1) % colors.length;
				PIDBox.style.width = `${boxWidth}px`;
				PIDBox.style.left = `${position}px`;
				PIDBox.style.marginTop = `20px`;
				PIDBox.innerText = `PID ${this.proc_num} \n Base ${this.p_base} \n Bounds ${this.p_bounds}`;
				document.getElementById('pid-container').appendChild(PIDBox);
				PIDBox.onclick = () => {
					rPID = this.proc_num;
					rPID_base = this.p_base;
					rPID_bounds = this.v_bounds;
				};
				PIDBox.ondblclick = () => {
					document.getElementById('pid-container').removeChild(PIDBox);
					const index = PIDarr.findIndex((pid) => pid.proc_num === this.proc_num);
					if (index !== -1) {
						PIDarr.splice(index, 1);

						let minVA = Infinity;
						let minPA = Infinity;
						PIDarr.forEach((pid) => {
							if (pid.v_bounds < minVA) minVA = pid.v_bounds;
							if (pid.p_bounds < minPA) minPA = pid.p_bounds;
						});
						MIN_VA = Math.ceil(Math.log2(minVA));
						MIN_PA = Math.ceil(Math.log2(minPA));

                        if (MIN_PA = Infinity) {
                            MIN_PA = 0;
                        }
                        if (MIN_VA = Infinity) {
                            MIN_VA = 0;
                            
                        }
					}
				};
			//} else {
			//	alert('Overlap exists with existing PID. Please choose a different range.');
			//}
		}
	}

	const calculatePhysicalBounds = () => {
		const base = parseInt(physicalBase, 10);
		const bounds = parseInt(virtualBounds, 10);
		physicalBounds = (base + bounds).toString();
		console.log('success');
	};

	const addPID = () => {
		if (PIDarr.length < 10) {
			const base = parseInt(physicalBase, 10);
			const bounds = parseInt(virtualBounds, 10);
			new PID(base, bounds);
		} else {
			alert('Cannot have more than 10 processes!');
		}
	};

	const calculatePA = () => {
		if ((parseInt(rPID_VA) < parseInt(rPID_bounds)) && (parseInt(rPID_VA) >=0)) {
			rPID_PA = parseInt(rPID_VA) + parseInt(rPID_base);
		} else {
			rPID_PA = 'Out of bounds';
		}
	};
</script>

<h1 class="bg-black text-white font-mono text-3xl font-bold flex items-center justify-center">
	Base & Bounds Visualization
</h1>
<div class="grid grid-cols-5 grid-rows-5 h-screen">
	<div class="col-span-2 row-span-3 bg-green-100 h-screen flex justify-center">
		<div class="flex-col">
			<form class="space-y-4 flex-col justify-content items-cente mt-5">
				<p class="mt-5 text-black font-mono text-center text-2xl font-bold pt-2">Process Creation</p>
				<div class="flex flex-col space-x-4">
				<label
					for="physical_base"
					class="text-black font-mono font-bold flex justify-center items-center text-center pt-6"
					>Enter Physical Base:</label
				>
				<input
					bind:value={physicalBase}
					class="block p-2 border rounded-md flex text-center w-200"
					placeholder="Physical Base"
					type="number"
					min="1"
					on:input={calculatePhysicalBounds}
				/>
				</div>
				<div class="flex flex-col space-x-4">
				<label
					for="virtual_bounds"
					class="text-black font-mono font-bold flex justify-center items-center text-center pt-2"
					>Enter Virtual Bounds:</label
				>
				<input
					bind:value={virtualBounds}
					class="block mt-1 p-2 border rounded-md text-center"
					placeholder="Virtual Bounds"
					type="number"
					min="1"
					on:input={calculatePhysicalBounds}
				/>
				</div>
				<div class="flex flex-col space-x-4">
				<label
					for="physical_bounds"
					class="text-black font-mono font-bold flex justify-center items-center text-center pt-2"
					>Physical Bounds:</label
				>
				<input
					bind:value={physicalBounds}
					class="flex mt-1 p-2 border rounded-md text-center"
					placeholder="Physical Bounds"
					readonly
				/>
				</div>
				<div class="flex flex-col space-x-4">
				<input type="submit" id="add_pid" class="hidden" on:click={addPID} />
				<label
					for="add_pid"
					class="text-black font-mono text-xl font-bold flex justify-center items-center text-center pt-2 cursor-pointer hover:text-blue-500"
					>Add PID</label
				>
				</div>
			</form>
		</div>
	</div>
	<div class="col-span-3 row-span-3 col-start-3 bg-red-100 h-screen flex justify-center">
		<form class="space-y-4 flex-col justify-content items-cente mt-5">
			<p class="text-black font-mono text-center text-2xl font-bold pt-2">MMU</p>
			<div class="flex flex-col space-x-4">
				<label for="running_PID" class="text-black font-mono font-bold">Running PID:</label>
				<input
					bind:value={rPID}
					id="running_PID"
					class="flex justify-center items-center mt-1 p-2 border rounded-md text-center"
					readonly
				/>
			</div>
			<div class="flex flex-col space-x-4">
				<label for="rp_base" class="text-black font-mono font-bold">Base:</label>
				<input
					bind:value={rPID_base}
					id="rp_base"
					class="flex justify-center items-center mt-1 p-2 border rounded-md text-center"
					readonly
				/>
			</div>
			<div class="flex flex-col space-x-4">
				<label for="rp_bound" class="text-black font-mono font-bold">Virtual Bounds:</label>
				<input
					bind:value={rPID_bounds}
					id="rp_bound"
					class="flex justify-center items-center mt-1 p-2 border rounded-md text-center"
					readonly
				/>
			</div>
			<div class="flex flex-col space-x-4">
				<label for="rp_va" class="text-black font-mono font-bold">Enter VA:</label>
				<input
					bind:value={rPID_VA}
					id="rp_va"
					class="flex justify-center items-center mt-1 p-2 border rounded-md text-center"
					on:input={calculatePA}
				/>
			</div>
			<div class="flex flex-col space-x-4">
				<label for="rp_pa" class="text-black font-mono font-bold">PA:</label>
				<input
					bind:value={rPID_PA}
					id="rp_pa"
					class="flex justify-center items-center mt-1 p-2 border rounded-md text-center"
					readonly
				/>
			</div>
		</form>
		<form class="space-y-4 flex-col justify-content items-center mt-5 mx-10">
			<p class="text-black font-mono text-center text-2xl font-bold pt-2">Min VA/PA</p>
			<div class="flex flex-col space-x-4">
				<label for="min_va" class="text-black font-mono font-bold">Min VA Length:</label>
				<input
					bind:value={MIN_VA}
					id="min_va"
					class="flex justify-center items-center mt-1 p-2 border rounded-md text-center"
					readonly
				/>
			</div>
			<div class="flex flex-col space-x-4">
				<label for="MIN_PA" class="text-black font-mono font-bold">Min PA Length:</label>
				<input
					bind:value={MIN_PA}
					id="MIN_PA"
					class="flex justify-center items-center mt-1 p-2 border rounded-md text-center"
					readonly
				/>
			</div>
		</form>
	</div>
	<div
		class="col-span-5 row-span-2 row-start-4 bg-blue-100 h-screen relative flex justify-center items-start"
	>
		<div id="pid-container" class="my-14 w-[1229px] h-[100px] bg-zinc-700 rounded-3xl">
			<p
				class="-mt-10 font-mono text-xl font-bold flex justify-center items-center text-center hover:text-blue-500"
				ondblclick="alert('To-do: make PID size dynamic, actually represent size on PA, allow creation >10')"
			>
				PT
			</p>
		</div>
	</div>
</div>