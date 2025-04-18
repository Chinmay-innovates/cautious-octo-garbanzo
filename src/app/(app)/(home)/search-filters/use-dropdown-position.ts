import { RefObject } from "react";

export const useDropdownPosition = (
	ref: RefObject<HTMLDivElement | null> | RefObject<HTMLButtonElement>
) => {
	const getDropdownPosition = () => {
		if (!ref.current) return { top: 0, left: 0 };
		const rect = ref.current.getBoundingClientRect();
		const dropdownWidth = 240;

		// Calculate the initial position of the dropdown
		let left = rect.left + window.scrollX;
		const top = rect.bottom + window.scrollY;

		// Check if dropdown is out of bounds on the right side of the screen
		if (left + dropdownWidth > window.innerWidth) {
			// set the left position to the right edge of the button
			left = rect.right + window.scrollX - dropdownWidth;

			if (left < 0) {
				left = window.innerWidth - dropdownWidth - 16; // 16 is the margin
			}
		}
		if (left < 0) {
			left = 16;
		}
		return { top, left };
	};

	return {
		getDropdownPosition,
	};
};
