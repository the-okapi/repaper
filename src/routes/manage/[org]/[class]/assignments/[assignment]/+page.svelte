<!--
<div class="box">
				<div>
					<p class="text-center italic">{formatDate(assignment.due_date)}</p>
					<h2 class="text-center text-2xl font-bold">{assignment.name}</h2>
					<p class="px-4 text-center">{assignment.description}</p>
					<div class="m-auto mt-8 h-40 w-fit">
						{#snippet changeName()}
							<form method="POST" action="?/changeName" class="m-auto w-fit">
								<Label.Root>{m.change()} {m.name()}:</Label.Root><br />
								<input value={form?.name} name="name" class="h-10 w-56" required />
								<Button.Root type="submit">{m.go()}</Button.Root>
								<input type="hidden" name="assignment" value={assignment.id} />
							</form>
							<p class="text-center">{form?.nameMessage}</p>
						{/snippet}
						{#snippet changeDescription()}
							<form
								method="POST"
								action="?/changeDescription"
								class="m-auto h-fit w-fit"
							>
								<Label.Root>{m.change()} Description:</Label.Root><br />
								<div class="mt-0.75 flex gap-1">
									<textarea
										value={form?.description}
										name="description"
										class="m-0! inline h-10 w-56"
										required></textarea>
									<Button.Root type="submit">{m.go()}</Button.Root>
								</div>
								<input type="hidden" name="assignment" value={assignment.id} />
							</form>
							<p class="text-center">{form?.descriptionMessage}</p>
						{/snippet}
						{#snippet changeDueDate()}
							<form method="POST" action="?/changeDueDate" class="m-auto w-fit">
								<Label.Root>{m.change()} {m.due_date()}:</Label.Root><br />
								<input
									type="datetime-local"
									class="h-10 w-56"
									bind:value={dueDate}
									required
								/>
								<Button.Root type="submit">{m.go()}</Button.Root>
								<input type="hidden" name="assignment" value={assignment.id} />
								<input
									type="hidden"
									name="dueDate"
									value={new Date(dueDate).toISOString()}
								/>
							</form>
							<p class="text-center">{form?.dueDateMessage}</p>
						{/snippet}
						{#snippet deleteAssignment()}
							<div class="mt-5 w-full">
								<Button.Root
									class="red-button m-auto block"
									onclick={() => {
										assignmentIndex = i;
										confirmDeleteOpen = true;
									}}>{m.delete()} {m.assignment()}</Button.Root
								>
							</div>
						{/snippet}
						<Tabs
							labels={[m.name(), 'Description', m.due_date(), m.delete()]}
							snippets={[
								changeName,
								changeDescription,
								changeDueDate,
								deleteAssignment
							]}
							class="m-auto"
						/>
					</div>
				</div>
			</div>
-->
