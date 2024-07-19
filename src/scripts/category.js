// Global flag to track the current view
let currentView = null;

export function initializeCategories() {
	// Determine if the view is mobile or desktop
	const isMobile = window.matchMedia("(max-width: 768px)").matches;

	// Check if the view has changed
	if (
		(isMobile && currentView !== "mobile") ||
		(!isMobile && currentView !== "desktop")
	) {
		// Clear previous initialization
		clearCategories();

		if (isMobile) {
			initializeMobileCategories();
			currentView = "mobile";
		} else {
			initializeDesktopCategories();
			currentView = "desktop";
		}
	}
}

// Add a resize event listener to reinitialize categories on resize
window.addEventListener("resize", initializeCategories);

function initializeDesktopCategories() {
	const categoryButtons = document.querySelectorAll(".category-btn");

	categoryButtons.forEach((button) => {
		const subcategories = JSON.parse(button.getAttribute("data-sub"));
		if (subcategories && subcategories.length > 0) {
			button.classList.add("has-subcategories");
		}

		const handleClick = (event) => {
			const subcategories = JSON.parse(button.getAttribute("data-sub"));
			const subcategoryContainer = document.getElementById(
				"subcategory-container"
			);

			const isActive = button.classList.contains("active");

			if (isActive) {
				button.classList.remove("active");
				button.parentElement.classList.remove("active");
				clearNextContainers(subcategoryContainer);
				subcategoryContainer.innerHTML = "";
				updateRightmostContainerBackground();
				return;
			}

			clearNextContainers(subcategoryContainer);
			subcategoryContainer.innerHTML = "";

			console.log("Desktop button clicked. Subcategories:", subcategories);
			renderDesktopSubcategories(subcategories, subcategoryContainer, 1);
			updateRightmostContainerBackground();

			const levelButtons = button
				.closest(".category-column")
				.querySelectorAll(".category-btn, .subcategory-btn");
			levelButtons.forEach((btn) => {
				btn.classList.remove("active");
				btn.classList.add("inactive"); // Add inactive class
			});

			button.classList.add("active");
			button.classList.remove("inactive"); // Remove inactive class
		};

		button.addEventListener("click", handleClick);

		const handleMouseOver = () => {
			if (button.classList.contains("has-subcategories")) {
				button.classList.add("hovered");
			}
		};

		const handleMouseOut = () => {
			button.classList.remove("hovered");
		};

		button.addEventListener("mouseover", handleMouseOver);
		button.addEventListener("mouseout", handleMouseOut);

		// Store the event listeners so they can be removed later
		button._desktopHandlers = { handleClick, handleMouseOver, handleMouseOut };
	});

	document
		.getElementById("main-categories")
		.classList.add("rightmost-container");
}

function renderDesktopSubcategories(subcategories, container, level) {
	console.log("Rendering desktop subcategories:", subcategories);
	const column = document.createElement("div");
	column.classList.add("category-column", `category-level-${level}`);

	subcategories.forEach((subcategory) => {
		for (const [key, value] of Object.entries(subcategory)) {
			console.log(`Processing desktop subcategory key: ${key}, value:`, value);
			const subcategoryWrapper = document.createElement("div");
			subcategoryWrapper.classList.add("subcategory-wrapper");

			if (Array.isArray(value)) {
				console.log("Rendering array desktop subcategory:", key);
				const subcategoryButton = document.createElement("button");
				subcategoryButton.classList.add("subcategory-btn", "has-subcategories");
				const buttonText = document.createElement("span");
				buttonText.classList.add("subcategory-btn-text");
				buttonText.textContent = key;
				subcategoryButton.appendChild(buttonText);
				subcategoryButton.addEventListener("click", (event) => {
					event.stopPropagation();
					console.log("Clicked desktop subcategory button:", key);

					const isSubcategoryActive =
						subcategoryButton.classList.contains("active");

					if (isSubcategoryActive) {
						subcategoryButton.classList.remove("active");
						subcategoryButton.parentElement.classList.remove("active");
						const nextContainer =
							subcategoryButton.closest(".category-column").nextElementSibling;
						if (nextContainer) {
							clearNextContainers(nextContainer);
							nextContainer.remove();
						}
						updateRightmostContainerBackground();
						return;
					}

					clearNextContainers(container);

					let nextContainer = container.nextElementSibling;
					if (!nextContainer) {
						nextContainer = document.createElement("div");
						nextContainer.classList.add(
							"category-container",
							`category-level-${level + 1}`
						);
						container.parentElement.appendChild(nextContainer);
					}

					nextContainer.innerHTML = "";
					renderDesktopSubcategories(value, nextContainer, level + 1);
					updateRightmostContainerBackground();

					const levelButtons = subcategoryButton
						.closest(".category-column")
						.querySelectorAll(".subcategory-btn");
					levelButtons.forEach((btn) => {
						btn.classList.remove("active");
						btn.classList.add("inactive"); // Add inactive class
					});

					subcategoryButton.classList.add("active");
					subcategoryButton.classList.remove("inactive"); // Remove inactive class
				});
				subcategoryWrapper.appendChild(subcategoryButton);
				column.appendChild(subcategoryWrapper);
			} else if (typeof value === "object" && value !== null && key !== "id") {
				console.log("Rendering single object desktop subcategory:", value);
				if (value.name) {
					const itemButton = document.createElement("button");
					itemButton.classList.add("subcategory-btn");
					const buttonText = document.createElement("span");
					buttonText.classList.add("subcategory-btn-text");
					buttonText.textContent = value.name;
					itemButton.appendChild(buttonText);
					subcategoryWrapper.appendChild(itemButton);
					column.appendChild(subcategoryWrapper);
				}
			} else if (key === "name") {
				console.log("Rendering direct name entry desktop subcategory:", value);
				const itemButton = document.createElement("button");
				itemButton.classList.add("subcategory-btn");
				const buttonText = document.createElement("span");
				buttonText.classList.add("subcategory-btn-text");
				buttonText.textContent = value;
				itemButton.appendChild(buttonText);
				subcategoryWrapper.appendChild(itemButton);
				column.appendChild(subcategoryWrapper);
			} else {
				console.warn("Unexpected desktop subcategory type:", key, value);
			}
		}
	});

	container.appendChild(column);
	updateRightmostContainerBackground();
}

function initializeMobileCategories() {
	const categoryButtons = document.querySelectorAll(".category-btn");

	categoryButtons.forEach((button) => {
		const subcategories = JSON.parse(button.getAttribute("data-sub"));
		if (subcategories && subcategories.length > 0) {
			button.classList.add("has-subcategories");
		}

		const handleClick = (event) => {
			console.log("Mobile button clicked:", button);
			const subcategories = JSON.parse(button.getAttribute("data-sub"));
			let subcategoryContainer = button.nextElementSibling;

			closeSiblingContainers(button);

			if (
				subcategoryContainer &&
				subcategoryContainer.classList.contains("subcategory-container")
			) {
				console.log("Toggling visibility of existing subcategory container");
				subcategoryContainer.classList.toggle("visible");
			} else {
				console.log("Creating new subcategory container");
				subcategoryContainer = document.createElement("div");
				subcategoryContainer.classList.add("subcategory-container");
				button.parentElement.insertBefore(
					subcategoryContainer,
					button.nextElementSibling
				);
				renderMobileSubcategories(subcategories, subcategoryContainer, 1);
				subcategoryContainer.classList.add("visible");
			}

			const levelButtons = button
				.closest(".category-column")
				.querySelectorAll(".category-btn");
			levelButtons.forEach((btn) => {
				btn.classList.remove("active");
				btn.classList.add("inactive"); // Add inactive class
			});

			button.classList.add("active");
			button.classList.remove("inactive"); // Remove inactive class
			button.parentElement.classList.add("active");

			console.log(
				"Current DOM structure after click:",
				document.body.innerHTML
			);
		};

		button.addEventListener("click", handleClick);

		// Store the event listener so it can be removed later
		button._mobileHandlers = { handleClick };
	});
}

function renderMobileSubcategories(subcategories, container, level) {
	console.log("Rendering mobile subcategories:", subcategories);
	const column = document.createElement("div");
	column.classList.add("category-column", `category-level-${level}`);

	subcategories.forEach((subcategory) => {
		for (const [key, value] of Object.entries(subcategory)) {
			const subcategoryWrapper = document.createElement("div");
			subcategoryWrapper.classList.add("subcategory-wrapper");

			if (Array.isArray(value)) {
				const subcategoryButton = document.createElement("button");
				subcategoryButton.classList.add("subcategory-btn", "has-subcategories");
				const buttonText = document.createElement("span");
				buttonText.classList.add("subcategory-btn-text");
				buttonText.textContent = key;
				subcategoryButton.appendChild(buttonText);
				subcategoryButton.addEventListener("click", (event) => {
					event.stopPropagation();
					console.log("Clicked mobile subcategory button:", key);

					closeSiblingContainers(subcategoryButton);

					let subSubcategoryContainer = subcategoryButton.nextElementSibling;
					if (
						subSubcategoryContainer &&
						subSubcategoryContainer.classList.contains("subcategory-container")
					) {
						console.log(
							"Toggling visibility of existing sub-subcategory container"
						);
						subSubcategoryContainer.classList.toggle("visible");
					} else {
						console.log("Creating new sub-subcategory container");
						subSubcategoryContainer = document.createElement("div");
						subSubcategoryContainer.classList.add("subcategory-container");
						subcategoryWrapper.appendChild(subSubcategoryContainer);
						renderMobileSubcategories(
							value,
							subSubcategoryContainer,
							level + 1
						);
						subSubcategoryContainer.classList.add("visible");
					}

					const levelButtons = subcategoryButton
						.closest(".category-column")
						.querySelectorAll(".subcategory-btn");
					levelButtons.forEach((btn) => {
						btn.classList.remove("active");
						btn.classList.add("inactive"); // Add inactive class
					});

					subcategoryButton.classList.add("active");
					subcategoryButton.classList.remove("inactive"); // Remove inactive class

					console.log(
						"Current DOM structure after subcategory click:",
						document.body.innerHTML
					);
				});
				subcategoryWrapper.appendChild(subcategoryButton);
				column.appendChild(subcategoryWrapper);
			} else if (typeof value === "object" && value !== null && key !== "id") {
				if (value.name) {
					const itemButton = document.createElement("button");
					itemButton.classList.add("subcategory-btn");
					const buttonText = document.createElement("span");
					buttonText.classList.add("subcategory-btn-text");
					buttonText.textContent = value.name;
					itemButton.appendChild(buttonText);
					subcategoryWrapper.appendChild(itemButton);
					column.appendChild(subcategoryWrapper);
				}
			} else if (key === "name") {
				const itemButton = document.createElement("button");
				itemButton.classList.add("subcategory-btn");
				const buttonText = document.createElement("span");
				buttonText.classList.add("subcategory-btn-text");
				buttonText.textContent = value;
				itemButton.appendChild(buttonText);
				subcategoryWrapper.appendChild(itemButton);
				column.appendChild(subcategoryWrapper);
			}
		}
	});

	container.appendChild(column);
}

function closeSiblingContainers(button) {
	console.log("Closing sibling containers for button:", button);
	const parentContainer = button.closest(".category-column");
	if (!parentContainer) return;

	const siblingButtons = Array.from(
		parentContainer.querySelectorAll(".category-btn, .subcategory-btn")
	).filter((child) => child !== button);

	siblingButtons.forEach((siblingButton) => {
		const siblingSubcategoryContainer = siblingButton.nextElementSibling;
		if (
			siblingSubcategoryContainer &&
			siblingSubcategoryContainer.classList.contains("subcategory-container")
		) {
			console.log("Removing sibling subcategory container");
			siblingSubcategoryContainer.remove();
		}
		siblingButton.classList.remove("active");
		siblingButton.parentElement.classList.remove("active");
		siblingButton.classList.add("inactive"); // Add inactive class
	});
}

function closeAllNestedContainers(container) {
	console.log("Closing all nested containers within:", container);
	const nestedContainers = container.querySelectorAll(".subcategory-container");
	nestedContainers.forEach((nestedContainer) => nestedContainer.remove());
}

function clearNextContainers(container) {
	while (container.nextElementSibling) {
		container.nextElementSibling.remove();
	}
}

function clearCategories() {
	const subcategoryContainer = document.getElementById("subcategory-container");
	clearNextContainers(subcategoryContainer);
	subcategoryContainer.innerHTML = "";

	const categoryColumns = document.querySelectorAll(".category-column");
	categoryColumns.forEach((column) => {
		if (!column.id) column.remove();
	});

	// Remove all event listeners from buttons
	const categoryButtons = document.querySelectorAll(
		".category-btn, .subcategory-btn"
	);
	categoryButtons.forEach((button) => {
		if (button._desktopHandlers) {
			button.removeEventListener("click", button._desktopHandlers.handleClick);
			button.removeEventListener(
				"mouseover",
				button._desktopHandlers.handleMouseOver
			);
			button.removeEventListener(
				"mouseout",
				button._desktopHandlers.handleMouseOut
			);
			delete button._desktopHandlers;
		}
		if (button._mobileHandlers) {
			button.removeEventListener("click", button._mobileHandlers.handleClick);
			delete button._mobileHandlers;
		}
		button.classList.remove(
			"has-subcategories",
			"active",
			"hovered",
			"inactive"
		);
	});
}

function updateRightmostContainerBackground() {
	if (currentView === "desktop") {
		const allContainers = document.querySelectorAll(
			".category-container, #main-categories"
		);

		allContainers.forEach((cont) =>
			cont.classList.remove("rightmost-container")
		);

		const lastContainer = allContainers[allContainers.length - 1];
		if (lastContainer) {
			lastContainer.classList.add("rightmost-container");
		}
	}
}

// Initialize categories on load
initializeCategories();
