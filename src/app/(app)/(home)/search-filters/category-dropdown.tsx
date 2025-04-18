"use client";
import { useRef, useState } from "react";
import { Category } from "@/payload-types";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDropdownPosition } from "./use-dropdown-position";
import { SubCategoryMenu } from "./sub-category-menu";

interface Props {
	category: Category;
	isActive?: boolean;
	isNavigationHovered?: boolean;
}

export const CategoryDropdown = ({
	category,
	isActive,
	isNavigationHovered,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { getDropdownPosition } = useDropdownPosition(dropdownRef);
	const onMouseEnter = () => {
		if (category.subcategories) {
			setIsOpen(true);
		}
	};
	const onMouseLeave = () => setIsOpen(false);
	const position = getDropdownPosition();

	return (
		<div
			ref={dropdownRef}
			className="relative"
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
		>
			<div className="relative">
				<Button
					variant={"elevated"}
					className={cn(
						"h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
						isActive && !isNavigationHovered && "bg-white border-primary"
					)}
				>
					{category.name}
				</Button>
				{category.subcategories && category.subcategories.length > 0 && (
					<div
						className={cn(
							"opacity-0 absolute -bottom-3 size-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-0.5",
							isOpen && "opacity-100"
						)}
					/>
				)}
			</div>
			<SubCategoryMenu
				category={category}
				isOpen={isOpen}
				position={position}
			/>
		</div>
	);
};
